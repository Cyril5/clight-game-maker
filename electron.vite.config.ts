import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({

  main: {
    build: {
      rollupOptions: {
        external: ['@electron-toolkit/utils']
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        external: ['@electron-toolkit/preload']
      }
    }
  },
  renderer: {
    esbuild: {
      minify: false,
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@engine' : resolve('src/engine'),
        path: "path-browserify",
      }
    },
    plugins: [vue()]
  },
})
