import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		// Using adapter-node for PM2/Node.js deployment
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		// CSRF protection enabled by default (checkOrigin: true)
		// Only disable if properly protected by other means (e.g., reverse proxy with strict origin checks)
		csrf: {
			checkOrigin: true
		}
	},

	extensions: ['.svelte', '.svx']
};

export default config;
