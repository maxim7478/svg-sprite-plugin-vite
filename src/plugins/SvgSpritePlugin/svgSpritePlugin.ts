import type { Plugin } from 'vite';
import fs from 'fs';
import * as path from 'path';
import fg from 'fast-glob';

export default function svgSpritePlugin(
    iconDir: string,
    xmlns: string = 'http://www.w3.org/2000/svg'
): Plugin {
  let sprite = '';

  return {
    name: 'svg-sprite-plugin-vite',
    enforce: 'post',

    configResolved(config) {
      if (!iconDir || typeof iconDir !== 'string') {
        throw new Error(`[svg-sprite-plugin-vite] invalid iconDir: ${iconDir}`);
      }

      const relDir = iconDir.replace(/^[/\\]+/, '');
      const absDir = path.resolve(config.root, relDir);

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

      sprite = `<svg xmlns="${xmlns}" style="display:none">${symbols.join('')}</svg>`;
    },

    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
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

