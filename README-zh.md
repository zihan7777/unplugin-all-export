# unplugin-all-export

自动把目录里的文件导出，子目录需要有`index`文件才会导出，支持 `vite` 和 `webpack`

## 安装

```bash
$ npm i unplugin-all-export -D
```

## 🚀 使用

**vite**

```ts
// vite.config.ts
import AllExport from 'unplugin-all-export/vite'

export default defineConfig({
  AllExport: [
    AllExport({
      dirs: ['src/utils'], // 要导出的目录名称
    }),
  ],
})
```

**webpack**

```js
//  webpack.config.js

module.exports = {
  resolve: {
    extensions: ['.js', '.ts'], // import时省略后缀
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
      extensions: ['.js', '.ts'], // import时省略后缀
    },
    plugins: [
      require('unplugin-all-export/webpack').default({
        /* options */
      }),
    ],
  },
})
```

## 示例

[Vite](/playground/vite)

[Webpack](/playground/webpack)

### 导出scss文件
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

### 导出vue文件
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

## 🔧 选项

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

### `output`
- 废弃 请使用 `formats`
- **Type:** `{ name : string , format : stirng }`
- **Default :** `{ name : index , format : ts }`
- 生成的文件名和后缀名 `index.ts`

### `formatter`
- 废弃 请使用 `formats`
- **Type:** `(name: string, suffix: string) => string`
- 导出语句 `exprot * from './${name}'`
