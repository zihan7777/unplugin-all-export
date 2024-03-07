import { createUnplugin } from 'unplugin'
import type { UnpluginOptions, WebpackCompiler } from 'unplugin'
import type { FSWatcher } from 'chokidar'
import type { Options, ViteAlias } from '../types'
import allExport from './ctx'

let watch: FSWatcher | undefined
function factory(options: Options): UnpluginOptions {
  return {
    name: 'unplugin-all-export',
    vite: {
      apply: 'serve',
      configResolved(config) {
        watch?.close()
        watch = allExport(options, config.resolve.alias)
      },
    },
    webpack: (compiler: WebpackCompiler) => {
      if (compiler.options.mode === 'production')
        return

      const alias: ViteAlias = Object.entries(
        compiler.options?.resolve?.alias || {},
      ).map(([key, val]) => ({ find: key, replacement: val as string }))

      allExport(options, alias)
    },
  }
}
export default createUnplugin(factory)
