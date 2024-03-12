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

## 🔧 Options

### `dirs`

- **Type:** `string | string[]`
- Directory to be exported

### `ignore`

- **Type:** `string | string[]`
- file to ignore

### `include`

- **Type:** `string[]`
- **Default :** `['vue', 'js', 'ts', 'json', 'jsx']`
- Supported file types for export

### `output`

- **Type:** `{ name : string , format : stirng }`
- **Default :** `{ name : index , format : ts }`
- The generated file name and suffix `index.ts`

### `formatter`

- **Type:** `(name: string, suffix: string) => string`
- Export statement `exprot * from './${name}'`
