import fs from 'node:fs'
import path from 'node:path'
import chokidar from 'chokidar'
import type { FSWatcher } from 'chokidar'
import anymatch from 'anymatch'
import type { DefaultOptions, Options, ViteAlias } from '../types'
import { defaultOptions } from './constants'
import { formatPath, mergeOption, toLowerCamelCase } from './utils'

export default function autoExport(
  options: Options,
  alias: ViteAlias = [],
): FSWatcher {
  const opt = mergeOption(options, defaultOptions, { alias })
  const { dirs, ignore, formats } = opt

  const roots = formatPath(dirs, alias)

  function generateFormatCode(file: string) {
    const { dir, name, ext } = path.parse(file)

    const { code: format, output }
      = formats.find((e) => RegExp(e.find).test(ext)) || {}

    if (!format) {
      console.log(`This file export failed ${file}`)
      return
    }

    return {
      output: output!,
      code: dir
        ? format(dir, ext, file)
        : format(toLowerCamelCase(name), ext, file),
    }
  }

  function generateWriteContent(dir: string) {
    const files = getDirFile(dir, opt)
    const tasks: Record<string, string[]> = {}

    function addTask(file: string) {
      const task = generateFormatCode(file)

      if (!task) return

      const { code, output } = task

      if (tasks[output])
        tasks[output].push(code)
      else
        tasks[output] = [code]
    }

    files.map((e) => {
      // folder
      if (fs.statSync(`${dir}/${e}`).isFile()) {
        addTask(e)
        return
      }

      // non folder
      const dirFiles = fs.readdirSync(`${dir}/${e}`)
      for (const i of dirFiles) {
        if (/^package.json$/.test(i)) {
          const { main } = JSON.parse(
            fs.readFileSync(`${dir}/${e}/package.json`, 'utf-8'),
          )
          if (main) {
            addTask(`${e}/${main}`)
            return
          }
        }
        if (/^index.(ts|js|vue)$/.test(i))
          addTask(`${e}/${i}`)
      }
    })

    return tasks
  }

  function watchHandle() {
    for (const root of roots) {
      if (!fs.existsSync(root)) {
        console.log(`The folder does not exist. to ${root}`)
        return
      }

      const tacks = generateWriteContent(root)

      Object.entries(tacks).map(([output, code]) => {
        fs.writeFileSync(`${root}/${output}`, code.join('\n'))
      })
    }
  }

  const watcher = chokidar.watch(roots, {
    ignored: formatPath(ignore as string[], alias),
  })

  watcher.on('add', watchHandle).on('unlink', watchHandle)

  return watcher
}

function getDirFile(dir: string, mergeOptions: DefaultOptions) {
  const { include, ignore, alias } = mergeOptions
  const ignored = formatPath(ignore as string[], alias)

  return fs.readdirSync(dir).filter((e) => {
    // filter out index files
    if (/^index.*$/.test(e)) return false

    if (e === 'package.json') return false

    const ext = path.extname(e)
    if (ext && !include.includes(ext.replace('.', ''))) return false

    // filter out the ignore file
    if (anymatch(ignored, path.resolve(dir, e))) return false

    return true
  })
}
