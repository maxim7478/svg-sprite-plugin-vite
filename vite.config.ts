import { defineConfig } from 'vite'
import svgSpritePlugin from './src/plugins/SvgSpritePlugin/svgSpritePlugin'

export default defineConfig({
  plugins: [
    svgSpritePlugin('src/assets/icons')
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SvgSpritePluginVite',
      formats: ['es', 'umd'],
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vite'],
    },
  },
})
