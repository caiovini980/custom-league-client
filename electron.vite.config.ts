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
    biome: {
      command: 'check',
      flags: '--write',
    },
  });

export default defineConfig({
  main: {
    build: {
      watch: {
        buildDelay: 200,
      },
    },
    plugins: [
      sql(),
      tsconfigPaths({
        configNames: ['tsconfig.node.json'],
      }),
      swcPlugin(),
      externalizeDepsPlugin({
        exclude: ['better-sqlite3'],
      }),
      bytecodePlugin(),
      checkerTs('./tsconfig.node.json'),
    ],
  },
  preload: {
    build: {
      watch: {
        buildDelay: 200,
      },
    },
    plugins: [
      tsconfigPaths({
        configNames: ['tsconfig.json'],
      }),
      externalizeDepsPlugin({
        exclude: ['lodash'],
      }),
      optimizeLodashImports(),
      bytecodePlugin(),
      checkerTs('./tsconfig.json'),
    ],
  },
  renderer: {
    plugins: [
      tsconfigPaths({
        configNames: ['tsconfig.web.json'],
      }),
      optimizeLodashImports(),
      react(),
      checkerTs('./tsconfig.web.json'),
    ],
  },
});
