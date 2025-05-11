import { defineConfig } from 'vite'
import { svgSpritePlugin } from './src/index'

export default defineConfig({
  plugins: [
    svgSpritePlugin('src/assets/icons')
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SvgSpritePluginVite',
      formats: ['es', 'umd'],
      fileName: format => `svg-sprite-vite.${format}.js`,
    },
    rollupOptions: {
      external: ['vite'],
    },
  },
})
