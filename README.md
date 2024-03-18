# unplugin-all-export

[中文文档](/README-zh.md)

Automatically export files from the directory, subdirectories need to have 'index' files to export, supports `vite` and ` webpack`

## Install

```bash
$ npm i unplugin-all-export -D
```

## 🚀 Usage

**vite**

```ts
// vite.config.ts
import AllExport from 'unplugin-all-export/vite'

export default defineConfig({
  AllExport: [
    AllExport({
      // The name of the directory to be exported
      dirs: ['src/utils'],
    }),
  ],
})
```

**webpack**

```js
//  webpack.config.js

module.exports = {
  resolve: {
    // Omit the suffix when importing
    extensions: ['.js', '.ts'],
  },
  plugins: [
    require('unplugin-all-export/webpack').default({
      /* options */
    }),
  ],
}
```

**vue-cli**

```js
//  vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  configureWebpack: {
    resolve: {
      // Omit the suffix when importing
      extensions: ['.js', '.ts'],
    },
    plugins: [
      require('unplugin-all-export/webpack').default({
        /* options */
      }),
    ],
  },
})
```

## Example

[Vite](/playground/vite)

[Webpack](/playground/webpack)

### Export scss file
```ts
// vite.config.ts
{
  include:['scss'],
}
```
Output
```scss
// index.scss
@use './one.scss';
@use './two.scss';
```

### Export vue file
```ts
// vite.config.ts
{
  include:['vue'],
}
```
Output
```ts
// index.ts
export { default as one } from './one.vue'
export { default as two } from './two.vue'
```

## 🔧 Options

### `dirs`

- **Type:** `string | string[]`
- Directory to be exported

### `ignore`

- **Type:** `string | string[]`
- file to ignore

### `include`

- **Type:** `string[]`
- **Default :** `['js', 'ts']`
- Supported file types for export

### `formats`

- **Type:** `Record<string , string> | Array<{ find: string; code: (name, suffix, filename) => string , output: string}>`
- **Default :**

```js

formats: [
    {
      find: '.json',
      code: "export { default as ${name} } from './${filename}'",
      output: defaultOutput, //index.ts
    },
    {
      find: '.js',
      code: "export * from './${name}'",
      output: defaultOutput,
    },
    {
      find: '.ts',
      code: "export * from './${name}'",
      output: defaultOutput,
    },
    {
      find: '.vue',
      code: "export { default as ${name} } from './${filename}'",
      output: defaultOutput,
    },
    {
      find: '.jsx',
      code: "export * from './${name}'",
      output: defaultOutput,
    },
    {
      find: '.tsx',
      code: "export * from './${name}'",
      output: defaultOutput,
    },
    {
      find: '.scss',
      code: "@use './${filename}';",
      output: 'index.scss',
    },
    {
      find: '.css',
      code: (name, suffix, filename) => `@import url('./${filename}');`,
      output: 'index.css',
    },
    {
      find: '.less',
      code: "@import './${filename}';",
      output: 'index.less',
    },
  ],
```

- Supported file types for export

### `output` deprecated

- @deprecated The next version will be discontinued, please use formats
- **Type:** `{ name : string , format : stirng }`
- **Default :** `{ name : index , format : ts }`
- The generated file name and suffix `index.ts`

### `formatter` deprecated

- @deprecated The next version will be discontinued, please use formats
- **Type:** `(name: string, suffix: string) => string`
- Export statement `exprot * from './${name}'`
