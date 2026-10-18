import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readdirSync, existsSync } from 'node:fs'

// The static SEO pages under public/<slug>/index.html are real files, served
// ahead of the SPA by .htaccess. They are precached so they work offline too,
// and kept out of the SPA navigation fallback so the shell never replaces them.
const STATIC_PAGES = readdirSync('public', { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(`public/${d.name}/index.html`))
  .map(d => d.name)

export default defineConfig({
  plugins: [
    react(),
    // Offline for the web build. The phone app already loads from the device
    // (Capacitor bundles dist); this gives tutagora.com the same: the shell,
    // bundles and fonts are precached on first visit, so HOREB practice runs
    // with no signal and the response outbox delivers when it returns.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null, // registered by hand in main.jsx — never inside the native shell
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'logo.png', 'logo-192.png'],
      manifest: {
        name: 'Tutagora',
        short_name: 'Tutagora',
        description: 'Adaptive CBC maths practice and verified Kenyan tutors.',
        theme_color: '#0f172a',
        background_color: '#eef0f2',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/logo.png', sizes: '128x128', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,ico}'],
        // Lottie is 1MB and only decorative: runtime-cached, not precached.
        // Lottie is 1MB and only decorative; the Agora chunk is 1.3MB and only
        // needed by someone joining a live video lesson, which needs a
        // connection anyway. Both are runtime-cached instead, so a learner who
        // only ever practises never spends mobile data on them.
        globIgnores: ['**/lottie/**', '**/og-image.png', '**/v-agora-*.js'],
        // Headroom over the default 2MB ceiling, which would silently skip a
        // chunk and leave the app unable to boot offline.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          new RegExp(`^/(${STATIC_PAGES.join('|')})(/|$)`),
          /^\/sitemap\.xml$/, /^\/robots\.txt$/,
        ],
        runtimeCaching: [
          { urlPattern: /\/assets\/v-agora-.*\.js$/, handler: 'CacheFirst',
            options: { cacheName: 'tg-agora', expiration: { maxEntries: 3, maxAgeSeconds: 30 * 86400 } } },
          { urlPattern: /\/lottie\//, handler: 'CacheFirst',
            options: { cacheName: 'tg-lottie', expiration: { maxEntries: 6, maxAgeSeconds: 30 * 86400 } } },
          { urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//, handler: 'StaleWhileRevalidate',
            options: { cacheName: 'tg-fonts' } },
          // Supabase, Paystack, Agora and the edge functions are never cached:
          // the response log has its own outbox, and everything else is live.
          { urlPattern: /^https:\/\/[a-z0-9]+\.supabase\.co\//, handler: 'NetworkOnly' },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Only the large, stable vendors are pinned by hand. Everything else is
        // left to Rollup, which splits it along the dynamic imports in
        // src/lazyRoutes.jsx. React and Supabase are pinned so that editing
        // content or a screen does not invalidate them in a returning
        // learner's cache; Agora is pinned so the service worker has a stable
        // name to keep out of the precache (see globIgnores above).
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('agora-rtc')) return 'v-agora';
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'v-react';
          if (id.includes('@supabase')) return 'v-supabase';
          return undefined;
        },
      },
    },
  }
})
