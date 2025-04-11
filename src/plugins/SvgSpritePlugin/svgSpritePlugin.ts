import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

export default function svgSpritePlugin(dir = 'src/assets/icons', xmlns = 'http://www.w3.org/2000/svg'): Plugin {
  let sprite = ''

  const generateSprite = () => {
    const icons = fs.readdirSync(dir).filter(f => f.endsWith('.svg'))

    const symbols = icons.map(file => {
      const id = path.basename(file, '.svg')
      const content = fs.readFileSync(path.resolve(dir, file), 'utf-8')

      const viewBoxMatch = content.match(/viewBox="([^"]+)"/)
      const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'

      const body = content
        .replace(/<svg[^>]*>/, '')
        .replace('</svg>', '')
        .trim()

      return `<symbol id="${id}" viewBox="${viewBox}" xmlns="${xmlns}">${body}</symbol>`
    })

    return `<svg xmlns="${xmlns}" style="display:none">${symbols.join('')}</svg>`
  }

  return {
    name: 'svg-sprite-plugin-vite',

    configResolved() {
      sprite = generateSprite()
    },

    transformIndexHtml(html) {
      return html.replace(/<body.*?>/, match => `${match}\n${sprite}`)
    },

    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg') && file.includes(dir)) {
        sprite = generateSprite()
        server.ws.send({ type: 'full-reload' })
      }
    }
  }
}
