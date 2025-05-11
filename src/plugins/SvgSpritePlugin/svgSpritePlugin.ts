import type {Plugin, ViteDevServer} from 'vite';
import fs from 'fs';
import * as path from 'path';
import fg from 'fast-glob';

function generateSvgSprite(absDir: string, xmlns: string): string {
  const files = fg.sync('**/*.svg', { cwd: absDir });
  const symbols = files.map(file => {
    const fullPath = path.join(absDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '';
    const inner = content
        .replace(/<svg[^>]*>/, '')
        .replace(/<\/svg>/, '');
    const id = path.basename(file, '.svg');
    return `<symbol id="${id}" viewBox="${viewBox}">${inner}</symbol>`;
  });
  return `<svg xmlns="${xmlns}" style="display:none">${symbols.join('')}</svg>`;
}


export default function svgSpritePlugin(
    iconDir: string,
    xmlns: string = 'http://www.w3.org/2000/svg'
): Plugin {
  let sprite = '';
  let absDir = '';
  let server: ViteDevServer;

  return {
    name: 'svg-sprite-plugin-vite',
    enforce: 'post',

    configResolved(config) {
      if (!iconDir || typeof iconDir !== 'string') {
        throw new Error(`[svg-sprite-plugin-vite] invalid iconDir: ${iconDir}`);
      }

      const relDir = iconDir.replace(/^[/\\]+/, '');
      absDir = path.resolve(config.root, relDir);

      if (!fs.existsSync(absDir)) {
        throw Error(`[svg-sprite-plugin-vite] Directory not found: ${absDir}`);
      }

      sprite = generateSvgSprite(absDir, xmlns);
    },

    configureServer(devServer: ViteDevServer) {
      server = devServer;
    },

    handleHotUpdate(ctx) {
      const file = ctx.file;
      if (absDir && file.startsWith(absDir) && file.endsWith('.svg')) {
        sprite = generateSvgSprite(absDir, xmlns);
        server.ws.send({ type: 'full-reload' });
      }
    },

    transformIndexHtml: {
      enforce: 'post',
      transform(html: string) {
        return {
          html,
          tags: [
            {
              tag: 'body',
              injectTo: 'body-prepend',
              children: sprite,
            },
          ],
        };
      },
    },
  };
}

