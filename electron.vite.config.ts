import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import react from '@vitejs/plugin-react';
import {
  bytecodePlugin,
  defineConfig,
  externalizeDepsPlugin,
  swcPlugin,
} from 'electron-vite';
import { Plugin } from 'vite';
import checker from 'vite-plugin-checker';
import { createHtmlPlugin } from 'vite-plugin-html'
import tsconfigPaths from 'vite-tsconfig-paths';

const sql = (): Plugin => {
  return {
    name: 'sql',
    transform(code, id) {
      if (/[.]sql/i.test(id)) {
        return `export default ${JSON.stringify(code)}`;
      }
      return {
        code,
        map: null,
      };
    },
  };
};

const checkerTs = (tsconfigPath: string) =>
  checker({
    typescript: {
      tsconfigPath,
    },
  });

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  const metaTag = () => {
    const tag = '<meta http-equiv="Content-Security-Policy" content="{content}" />'
    const keyValueMeta: Record<string, string[]> = {
      'default-src': [],
      'connect-src': [],
      'script-src': [],
      'style-src': ["'unsafe-inline'"],
      'img-src': ['blob:', 'data:', 'https://ddragon.leagueoflegends.com', 'https://raw.communitydragon.org', 'https://cmsassets.rgpub.io'],
      'media-src': ['https://raw.communitydragon.org', 'https://cmsassets.rgpub.io', 'https://yoututbe.com'],
      'frame-src': ['https://embed.rgpub.io', 'https://www.youtube.com', 'https://youtube-nocookie.com', 'https://ftw.riotgames.com']
    }

    if (isDev) {
      keyValueMeta['connect-src'].push('ws://localhost:8097')
    }

    const content = Object.keys(keyValueMeta).reduce((prev, key) => {
      const meta = `${prev} ${key} 'self' ${keyValueMeta[key].join(' ')}`.trim()
      return `${meta};`.trim()
    }, '')

    return tag.replace('{content}', content)
  }

  return {
    main: {
      build: {
        watch: {
          buildDelay: 1500,
        },
      },
      plugins: [
        sql(),
        tsconfigPaths({
          configNames: ['tsconfig.node.json'],
        }),
        swcPlugin(),
        externalizeDepsPlugin({
          exclude: ['better-sqlite3', 'mime', 'p-limit'],
        }),
        bytecodePlugin(),
        checkerTs('./tsconfig.node.json'),
      ],
    },
    preload: {
      build: {
        watch: {
          buildDelay: 1500,
        },
      },
      plugins: [
        tsconfigPaths({
          configNames: ['tsconfig.json'],
        }),
        externalizeDepsPlugin({
          exclude: ['lodash-es'],
        }),
        optimizeLodashImports(),
        bytecodePlugin(),
      ],
    },
    renderer: {
      server: {
        watch: {
          usePolling: true,
          interval: 1000,
          ignored: ['**/.idea/**', '**/node_modules/**']
        }
      },
      plugins: [
        tsconfigPaths({
          configNames: ['tsconfig.web.json'],
        }),
        optimizeLodashImports(),
        react(),
        checkerTs('./tsconfig.web.json'),
        createHtmlPlugin({
          inject: {
            data: {
              reactDevtoolsScript: isDev ? '<script src="http://localhost:8097"></script>' : undefined,
              csp: metaTag()
            }
          },
        })
      ],
    },
  }
});
