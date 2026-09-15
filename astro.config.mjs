// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import nordLightTheme from './src/styles/nord-light-theme.json';

// https://astro.build/config
export default defineConfig({
  site: 'https://marinus-blog.pages.dev',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: /** @type {any} */ (nordLightTheme),
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

