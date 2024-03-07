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

  output?: {
    name?: string
    format: 'ts' | 'js'
  }

  formatter?: (name: string, suffix: string) => string
}

export type DefaultOptions = Required<Options & { alias: ViteAlias }>

export type ViteAlias = AliasOptions & Alias[]
