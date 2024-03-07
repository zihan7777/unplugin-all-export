const { defineConfig } = require('@vue/cli-service')
const AllExport = require('../../dist/webpack.cjs')

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    resolve: {
      extensions: ['.js', '.ts'],
    },
    plugins: [
      AllExport.default({
        dirs: ['../../test/exportDir'],
      }),
    ],
  },
})
