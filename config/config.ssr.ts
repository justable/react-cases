import { defineConfig } from 'umi';

export default defineConfig({
  ssr: {
    devServerRender: false,
  },
  hash: false,
  base: '/',
  publicPath: '/',
  // dynamicImport: false,
});
