import react from '@vitejs/plugin-react';

import path from 'path';
import { defineConfig } from 'vite';
import electron from 'vite-electron-plugin';
import { alias, copy } from 'vite-electron-plugin/plugin';
import checker from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';

import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    checker({}),
    tsconfigPaths(),
    // visualizer(), // 分析文件大小
    electron({
      include: ['app'],
      plugins: [
        alias([
          {
            find: '@app',
            replacement: path.join(__dirname, 'app'),
          },
        ]),
        copy([{ from: 'electron-builder.json', to: 'dist-electron/app.json' }]),
      ],
    }),
  ],
  clearScreen: false,
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    minify: process.env.NODE_ENV === 'production' ? false : 'esbuild',
    sourcemap: process.env.NODE_ENV !== 'production',
  },
});
