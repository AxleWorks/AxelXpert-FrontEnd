import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@emotion/cache',
      '@emotion/sheet',
      '@emotion/serialize',
      '@babel/runtime/helpers/typeof',
      '@babel/runtime/helpers/slicedToArray',
      '@babel/runtime/helpers/asyncToGenerator',
      '@babel/runtime/helpers/defineProperty',
      '@babel/runtime/helpers/esm/extends',
      '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose',
      '@babel/runtime/helpers/esm/inheritsLoose',
      '@babel/runtime/helpers/esm/assertThisInitialized'
    ]
  },
  resolve: {
    alias: {
      '@emotion/cache': '@emotion/cache',
      '@emotion/sheet': '@emotion/sheet',
      '@emotion/serialize': '@emotion/serialize'
    }
  }
})
