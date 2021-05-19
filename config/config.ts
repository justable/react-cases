// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';

import routes from './routes';

const FileManagerPlugin = require('filemanager-webpack-plugin');

const { NODE_ENV } = process.env;

export default defineConfig({
  base: NODE_ENV === 'production' ? '/reactcases/' : '/',
  publicPath: NODE_ENV === 'production' ? '/reactcases/' : '/',
  hash: true,
  antd: {},
  dva: {
    immer: true,
    hmr: true,
  },
  dynamicImport: {
    loading: '@/pages/Loading',
  },
  targets: {
    ie: 11,
  },
  routes,
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    if (NODE_ENV !== 'production') return;
    memo
      .plugin('FileManagerPlugin')
      .use(
        new FileManagerPlugin({
          events: {
            onEnd: {
              archive: [{ source: './dist', destination: 'dist.zip' }],
            },
          },
        }),
      )
      .end();
  },
});
