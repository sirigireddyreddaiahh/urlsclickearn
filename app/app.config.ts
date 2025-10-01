export default defineAppConfig({
  title: 'Urlsclickearn',
  email: 'urlsclickearn.xyz@miantiao.me',
  github: 'https://github.com/ccbikai/urlsclickearn',
  twitter: 'https://urlsclickearn.xyz/kai',
  telegram: 'https://urlsclickearn.xyz/telegram',
  mastodon: 'https://urlsclickearn.xyz/mastodon',
  blog: 'https://urlsclickearn.xyz/blog',
  description: 'A Simple / Speedy / Secure Link Shortener with Analytics, 100% run on Cloudflare. Urlsclickearn.',
  image: 'https://urlsclickearn.xyz/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})

