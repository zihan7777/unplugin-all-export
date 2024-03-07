import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AllExport from '../../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AllExport({
      dirs: ['../../test/exportDir'],
    }),
  ],
})
