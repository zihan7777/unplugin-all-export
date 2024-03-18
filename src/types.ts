import type { Alias, AliasOptions } from 'vite'
import type chokidar from 'chokidar'
export interface Options {
  /**
   * @default []
   */
  dirs: string[]
  /**
   * @default []
   */
  ignore?: chokidar.WatchOptions['ignored']

  include?: string[]

  formats?: FormatObject | FormatArray
  /**
   * @deprecated The next version will be discontinued, please use formats
   */
  output?: {
    name?: string
    format: 'ts' | 'js'
  }

  /**
   * @deprecated The next version will be discontinued, please use formats
   */
  formatter?: (name: string, suffix: string) => string
}

// export type DefaultOptions = Required<
//   Options & { alias: ViteAlias; formats: FormatArray }
// >

export interface DefaultOptions extends Required<Options> {
  alias: ViteAlias
  formats: Array<{ find: string, code: FormatFn, output?: string }>
}

export type ViteAlias = AliasOptions & Alias[]

export type FormatFn = (
  name: string,
  suffix: string,
  filename: string,
) => string

export type FormatObject = Record<string, FormatFn | string>
export type FormatArray = FormatItem[]
export interface FormatItem {
  find: string
  code: string | FormatFn
  output?: string
}
