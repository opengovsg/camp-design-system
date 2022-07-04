import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'node:path'
import copy from 'rollup-plugin-copy'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    copy({
      targets: [{ src: 'src/fonts', dest: 'build' }],
      hook: 'writeBundle',
    }),
    dts({
      outputDir: 'build/types',
      insertTypesEntry: true,
    }),
  ],
  build: {
    outDir: 'build',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'opengovsgdesignsystemreact',
      formats: ['es', 'umd'],
      fileName: (format) => `main.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    target: 'es6',
    sourcemap: false,
    minify: true,
  },
})
