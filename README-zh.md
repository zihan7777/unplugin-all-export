# unplugin-all-export


自动把目录里的文件导出，子目录需要有`index`文件才会导出，支持 `vite` 和 `webpack`

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
      dirs: ['src/utils'], //要导出的目录名称
    }),
  ],
})
```

**webpack**

```js
//  webpack.config.js

module.exports = {
  resolve: {
    extensions: ['.js', '.ts'], //import时省略后缀
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
      extensions: ['.js', '.ts'], //import时省略后缀
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
- 需要导出的目录

### `ignore`

- **Type:** `string | string[]`
- 要忽略的文件

### `include`

- **Type:** `string[]`
- **Default :** `['vue', 'js', 'ts', 'json', 'jsx']`
- 支持导出的文件类型

### `output`

- **Type:** `{ name : string , format : stirng }`
- **Default :** `{ name : index , format : ts }`
- 生成的文件名和后缀名 `index.ts`

### `formatter`

- **Type:** `(name: string, suffix: string) => string`
- 导出语句 `exprot * from './${name}'`
