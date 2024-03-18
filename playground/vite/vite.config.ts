import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AllExport from '../../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AllExport({
      dirs: [
        '../../test/example',
        '../../test/example/mix',
        '../../test/example/css',
        '../../test/example/js',
        '../../test/example/ts',
        '../../test/example/json',
        '../../test/example/jsx',
        '../../test/example/tsx',
        '../../test/example/less',
        '../../test/example/scss',
        '../../test/example/vue',
      ],
    }),
  ],
})
