import {defineConfig} from 'vite';
import vinext from 'vinext';
import {cloudflare} from '@cloudflare/vite-plugin';

export default defineConfig(({command}) => ({
  server: {host: '127.0.0.1', port: 5173},
  plugins: [
    vinext(),
    cloudflare({
      configPath: 'wrangler.json',
      // Vite must serve CSS and virtual browser modules during local development.
      // Production keeps the authenticated worker-first routing in wrangler.json.
      ...(command === 'serve' ? {
        config: config => ({assets: {...config.assets, run_worker_first: false}}),
      } : {}),
      viteEnvironment: {name: 'rsc', childEnvironments: ['ssr']},
      inspectorPort: false,
    }),
  ],
}));
