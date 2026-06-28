// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://aakriti.in',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.jsonc',
    },
  }),
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        // CRITICAL: Ignore .wrangler directory. It contains D1/KV/Cache
        // SQLite files that change on every API call. Without this,
        // Vite detects those file changes and triggers full page reloads,
        // which wipes all React client state (the booking flow crash).
        ignored: ['**/.wrangler/**'],
      },
    },
    optimizeDeps: {
      exclude: ['noop-middleware', 'astro/compiler-runtime', 'framer-motion'],
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-day-picker',
        'date-fns',
        'date-fns/format',
        'date-fns/parseISO',
        'date-fns/startOfToday',
        'lucide-react',
        'sonner',
        'clsx',
        'tailwind-merge',
      ],
    },
    ssr: {
      optimizeDeps: {
        exclude: ['noop-middleware', 'astro/compiler-runtime', 'framer-motion'],
      },
    },
  },
});
