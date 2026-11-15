// @ts-check
import { defineConfig } from 'astro/config';

// Deployed on GitHub Pages as a project site.
// For a custom domain later: set `site` to it, remove `base` and add public/CNAME.
export default defineConfig({
  site: 'https://michaelwautier.github.io',
  base: '/ailleurs-site',
  trailingSlash: 'ignore',
});
