import type { Options } from '../types'
import { isTypescriptEnvironment, toLowerCamelCase } from './utils'

const defaultOutput = `index.${isTypescriptEnvironment() ? 'ts' : 'js'}`
export const defaultOptions: Options = {
  dirs: [],
  ignore: [],
  include: ['js', 'ts'],
  formats: [
    {
      find: '.json',
      code: (name, ext, filename) =>
        `export { default as ${toLowerCamelCase(
          name,
        )} } from \'./${filename}\'`,
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
      code: (name, ext, filename) =>
        `export { default as ${toLowerCamelCase(
          name,
        )} } from \'./${filename}\'`,
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
