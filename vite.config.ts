import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'src/electron/main.ts',
        vite: {
          build: {
            ssr: true,
            lib: {
              entry: 'src/electron/main.ts',
              formats: ['cjs'],
              fileName: () => '[name].cjs',
            },
            rollupOptions: {
              external: ['electron', 'path', 'fs', 'fs/promises', 'os', 'url'],
            },
          },
        },
      },
      {
        entry: 'src/electron/preload.ts',
        vite: {
          build: {
            ssr: true,
            lib: {
              entry: 'src/electron/preload.ts',
              formats: ['cjs'],
              fileName: () => '[name].cjs',
            },
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
        onstart(options) {
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
