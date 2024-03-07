import fs from 'node:fs'
import path from 'node:path'
import { normalizePath } from 'vite'
import chokidar from 'chokidar'
import type { FSWatcher } from 'chokidar'
import anymatch from 'anymatch'
import { merge } from 'lodash-unified'
import type { DefaultOptions, Options, ViteAlias } from '../types'

function getFileInfo(file: string) {
  const suffix = path.extname(file)
  const name = path.basename(file, suffix)
  return { name, suffix }
}

const defaultOptions: Options = {
  dirs: [],
  ignore: [],
  include: ['vue', 'js', 'ts', 'json', 'jsx'],
  formatter: defaultFormatter,
  output: {
    name: 'index',
    format: 'ts',
  },
}

export default function autoExport(
  options: Options,
  alias: ViteAlias = [],
): FSWatcher {
  const mergeOptions = merge({}, defaultOptions, options, {
    alias,
  }) as DefaultOptions

  const { dirs, ignore, output } = mergeOptions

  const dirPaths = formatPath(dirs, alias)
  const watcher = chokidar.watch(dirPaths, {
    ignored: formatPath(ignore as string[], alias),
  })

  watcher.on('add', watchHandle).on('unlink', watchHandle)

  function watchHandle() {
    for (const dir of dirPaths) {
      if (!fs.existsSync(dir)) {
        console.log(`The folder does not exist. to ${dir}`)
        return
      }

      const content = generateWriteContent(dir, mergeOptions)

      // write output file
      fs.writeFileSync(`${dir}/${output.name}.${output.format}`, content)
    }
  }

  return watcher
}

function generateWriteContent(dir: string, mergeOptions: DefaultOptions) {
  const { formatter } = mergeOptions

  const files = getDirFile(dir, mergeOptions)

  const content = files
    .map((e) => {
      const { name, suffix } = getFileInfo(e)
      // folder
      if (fs.statSync(`${dir}/${e}`).isFile())
        return formatter(name, suffix)

      // non folder
      const dirFiles = fs.readdirSync(`${dir}/${e}`)
      for (const i of dirFiles) {
        if (/^package.json$/.test(i)) {
          const { main } = JSON.parse(
            fs.readFileSync(`${dir}/${e}/package.json`, 'utf-8'),
          )
          const { name } = getFileInfo(main)
          if (main) return formatter(`${e}/${name}`, '')
        }

        if (/^index.(ts|js|vue)$/.test(i)) return formatter(`${e}`, '')
      }
      return ''
    })
    .join('\n')

  return content
}

function getDirFile(dir: string, mergeOptions: DefaultOptions) {
  const { include, ignore, alias } = mergeOptions
  const ignored = formatPath(ignore as string[], alias)

  return fs.readdirSync(dir).filter((e) => {
    // filter out index files
    if (/^index.*$/.test(e))
      return false

    if (e === 'package.json')
      return false

    const ext = path.extname(e)
    if (ext && !include.includes(ext.replace('.', '')))
      return false

    // filter out the ignore file
    if (anymatch(ignored, path.resolve(dir, e)))
      return false

    return true
  })
}

function formatPath(paths: string | string[], alias: ViteAlias) {
  const pathArray = Array.isArray(paths) ? paths : [paths]

  return pathArray.map((p) => {
    let result: string = ''
    const matchedEntry = alias.find((e) => matches(e.find, p))

    result = matchedEntry
      ? p.replace(matchedEntry.find, matchedEntry.replacement)
      : p
    return normalizePath(path.resolve(result))
  })
}

function defaultFormatter(name: string, suffix?: string) {
  if (suffix === '.json')
    return `export { default as ${name} } from './${name}${suffix}'`

  return `export * from './${name}'`
}

function matches(pattern: string | RegExp, dir: string) {
  if (pattern instanceof RegExp) return pattern.test(dir)

  if (dir.length < pattern.length) return false

  if (dir === pattern) return true

  return dir.startsWith(`${pattern}/`)
}
