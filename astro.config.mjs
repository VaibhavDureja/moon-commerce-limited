import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mooncommercelimited.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  vite: {
    build: {
      assetsInlineLimit: file => /\.woff2?$/.test(file) ? false : undefined
    }
  },
  devToolbar: { enabled: false }
});
