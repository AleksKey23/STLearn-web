import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('svelte/compiler').Config} */
const config = {
  preprocess: vitePreprocess(),
  compilerOptions: {
    compatibility: {
      componentApi: 4
    }
  }
};

export default config;