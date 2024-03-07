import path from 'node:path'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import fg from 'fast-glob'
import AllExport from '../src/core/ctx'
import type { DefaultOptions } from '../src/types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const optios: DefaultOptions = {
  include: ['ts', 'js', 'json'],
  dirs: ['test/exportDir'],
  ignore: ['test/exportDir/f', 'test/exportDir/e.*'],
  formatter: (name) => `export * from './${name}'`,
  alias: [],
  output: {
    name: 'index',
    format: 'ts',
  },
}
const { output, dirs, ignore } = optios

const outputFile = `${output.name}.${output.format}`

describe('index', async () => {
  AllExport(optios)
  await sleep(50)

  it('ignore file', async () => {
    const ignoreFiles = await fg(ignore as string[], { onlyFiles: false })
    if (!ignoreFiles.length) return

    for (const ignoreFile of ignoreFiles) {
      const { dir, base } = path.parse(ignoreFile)
      const outputContent = fs.readFileSync(path.join(dir, outputFile), 'utf-8')

      const hasIgnoreFile = outputContent.includes(optios.formatter(base, ''))

      expect(hasIgnoreFile).toBe(false)
    }
  })

  it('generate output file', () => {
    dirs.forEach((e) => {
      expect(fs.existsSync(`${e}/${outputFile}`)).toBe(true)
    })
  })
})
