import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// adapter-node supports Node.js environments; swap if you need a different runtime.
		adapter: adapter(),
		paths: {
			relative: false // Required for PostHog session replay to work correctly
		}
	}
};

export default config;
