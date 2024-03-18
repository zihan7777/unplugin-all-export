import path from 'node:path'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import fg from 'fast-glob'
import AllExport from '../src/core/ctx'
import { transformFormat } from '../src/core/utils'
import type { FormatFn, Options } from '../src/types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const optios: Options = {
  include: ['ts', 'js', 'json'],
  dirs: ['test/example'],
  ignore: ['test/example/json'],
  formats: [
    {
      find: '.ts',
      code: 'export * from "./${name}"',
      output: 'index.ts',
    },
  ],
}
const { dirs, ignore } = optios

const { output: outputFile, code } =
  transformFormat(optios.formats!).find((e) => e.find === '.ts') || {}

describe('index', async () => {
  AllExport(optios)
  await sleep(50)

  it('ignore file', async () => {
    const ignoreFiles = await fg(ignore as string[], { onlyFiles: false })
    if (!ignoreFiles.length) return

    for (const ignoreFile of ignoreFiles) {
      const { dir, base, ext } = path.parse(ignoreFile)
      const outputContent = fs.readFileSync(path.join(dir, 'index.ts'), 'utf-8')

      const hasIgnoreFile = outputContent.includes(
        (code as FormatFn)(base, ext, ignoreFile),
      )

      expect(hasIgnoreFile).toBe(false)
    }
  })

  it('generate output file', () => {
    dirs.forEach((e) => {
      expect(fs.existsSync(`${e}/${outputFile}`)).toBe(true)
    })
  })
})
