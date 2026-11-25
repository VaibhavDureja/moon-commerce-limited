import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mooncommercelimited.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  devToolbar: { enabled: false }
});
