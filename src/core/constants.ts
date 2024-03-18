import type { Options } from '../types'
import { isTypescriptEnvironment } from './utils'

const defaultOutput = `index.${isTypescriptEnvironment() ? 'ts' : 'js'}`
export const defaultOptions: Options = {
  dirs: [],
  ignore: [],
  include: ['js', 'ts'],
  formats: [
    {
      find: '.json',
      code: 'export { default as ${name} } from \'./${filename}\'',
      output: defaultOutput,
    },
    {
      find: '.js',
      code: 'export * from \'./${name}\'',
      output: defaultOutput,
    },
    {
      find: '.ts',
      code: 'export * from \'./${name}\'',
      output: defaultOutput,
    },
    {
      find: '.vue',
      code: 'export { default as ${name} } from \'./${filename}\'',
      output: defaultOutput,
    },
    {
      find: '.jsx',
      code: 'export * from \'./${name}\'',
      output: defaultOutput,
    },
    {
      find: '.tsx',
      code: 'export * from \'./${name}\'',
      output: defaultOutput,
    },
    {
      find: '.scss',
      code: '@use \'./${filename}\';',
      output: 'index.scss',
    },
    {
      find: '.css',
      code: (name, suffix, filename) => `@import url('./${filename}');`,
      output: 'index.css',
    },
    {
      find: '.less',
      code: '@import \'./${filename}\';',
      output: 'index.less',
    },
  ],
}
