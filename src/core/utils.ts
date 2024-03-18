import path from 'node:path'
import fs from 'node:fs'
import { normalizePath } from 'vite'
import { keyBy, merge } from 'lodash-unified'
import type {
  DefaultOptions,
  FormatArray,
  FormatFn,
  FormatObject,
  Options,
  ViteAlias,
} from '../types'

export function transformFormat(formats: FormatObject | FormatArray): FormatArray {
  if (Array.isArray(formats)) {
    return formats.map((e) => ({
      ...e,
      code: strToFn(e.code),
    }))
  }

  return Object.entries(formats).map(([find, code]) => ({
    find,
    code: strToFn(code),
  }))
}

function strToFn(code: string | FormatFn): FormatFn {
  if (typeof code === 'function') return code
  return (name, suffix, filename) =>
    code
      .replace(/\${name}/, name)
      .replace(/\${suffix}/, suffix)
      .replace(/\${filename}/, filename)
}

export function matches(pattern: string | RegExp, dir: string) {
  if (pattern instanceof RegExp) return pattern.test(dir)

  if (dir.length < pattern.length) return false

  if (dir === pattern) return true

  return dir.startsWith(`${pattern}/`)
}

export function formatPath(paths: string | string[], alias: ViteAlias) {
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
// TODO fix merge
export function mergeOption(
  options: Options,
  defaultOptions: Options,
  ...args: Parameters<typeof merge>
): DefaultOptions {
  if (options.formats) {
    options.formats = keyBy(
      transformFormat(options.formats),
      'find',
    ) as unknown as Options['formats']
  }

  if (defaultOptions.formats) {
    defaultOptions.formats = keyBy(
      transformFormat(defaultOptions.formats),
      'find',
    ) as unknown as Options['formats']
  }
  const result = merge({}, defaultOptions, options, ...args)

  result.formats = Object.values(result.formats as any) as Options['formats']

  if (options.include)
    result.include = options.include

  return result as DefaultOptions
}

export function isTypescriptEnvironment() {
  return fs.existsSync('tsconfig.json')
}

export function toLowerCamelCase(str: string) {
  return str.replace(/[-_\s]+(.)?/g, (_, $1) => ($1 ? $1.toUpperCase() : ''))
}
