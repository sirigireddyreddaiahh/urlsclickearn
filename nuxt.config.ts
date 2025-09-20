// import { currentLocales } from './i18n/i18n' // i18n removed, only English supported
// File: nuxt.config.ts

import { currentLocales } from './i18n/i18n'
export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    'shadcn-nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],
  devtools: { enabled: true },
  colorMode: { classSuffix: '' },
  runtimeConfig: {
    siteToken: 'Urlsclickearn',
    redirectStatusCode: '301',
    linkCacheTtl: 60,
    redirectWithQuery: false,
    homeURL: '',
    cfAccountId: '',
    cfApiToken: '',
    dataset: 'Urlsclickearn',
    aiModel: '@cf/meta/llama-3.1-8b-instruct',
    aiPrompt: `You are a URL shortening assistant, please shorten the URL provided by the user into a SLUG. The SLUG information must come from the URL itself, do not make any assumptions. A SLUG is human-readable and should not exceed three words and can be validated using regular expressions {slugRegex} . Only the best one is returned, the format must be JSON reference {"slug": "example-slug"}`,
    caseSensitive: false,
    listQueryLimit: 500,
    disableBotAccessLog: false,
    public: {
      previewMode: '',
      slugDefaultLength: '6',
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/dashboard/**': { prerender: true, ssr: false },
    '/dashboard': { redirect: '/dashboard/links' },
    '/login': { redirect: '/auth/login' },
    '/signup': { redirect: '/auth/signup' },
  },
  future: { compatibilityVersion: 4 },
  experimental: { enforceModuleCompatibility: false },
  compatibilityDate: { cloudflare: '2025-05-08' },
  nitro: {
    preset: 'cloudflare-pages',
    experimental: { openAPI: false },
  externals: { inline: ['zod', 'mime', 'bcryptjs', 'jsonwebtoken', 'nodemailer', 'nanoid', 'mysql-bricks', 'sql-bricks', 'ua-parser-js', 'intl-parse-accept-language', 'ufo', 'destr'] },
    timing: false,
    publicAssets: [
      { baseURL: '/', dir: 'public' },
    ],
  },
  hub: {
    ai: true,
    analytics: true,
    blob: false,
    cache: false,
    database: false,
    kv: true,
    workers: true,
  },
  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },
  i18n: {
    locales: currentLocales,
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'urlsclickearn_i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: '/', // <-- FIXED property name
    defaultLocale: 'en-US',
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
  vite: {
    build: {
      target: 'esnext',
    },
    ssr: {
      noExternal: [
        'mime',
        'zod',
        'bcryptjs',
        'jsonwebtoken',
        'nodemailer',
        'nanoid',
        'mysql-bricks',
        'sql-bricks',
        'ua-parser-js',
        'intl-parse-accept-language',
        'ufo',
        'destr',
      ],
    },
    plugins: [
      {
        name: 'fix-mime-top-this',
        enforce: 'pre',
        apply: 'build',
        transform(code: string, id: string) {
          if (!/node_modules[\/].*mime.*dist[\/]src[\/]Mime.js/.test(id)) {
            return null;
          }
          const fixed = code.replace(
            /\bthis\b/g,
            '(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : {}))'
          );
          return {
            code: fixed,
            map: null
          };
        }
      }
    ],
  },
})
