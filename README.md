# ⚡ Urlsclickearn

# ⚡ Urlsclickearn

**A Fast, Serverless, and Secure Link Shortener with Analytics — 100% Cloudflare Native**

![Cloudflare](https://img.shields.io/badge/Cloudflare-F69652?style=flat&logo=cloudflare&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=flat&logo=nuxtdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white)

---

## 🚀 Overview

Urlsclickearn is a modern, privacy-friendly link shortener and analytics platform built for speed, security, and scalability. Powered entirely by Cloudflare (Workers, KV, Analytics), it requires zero server maintenance and is ready for global scale.

**Live Demo:** [urlsclickearn.cool/dashboard](https://urlsclickearn.cool/dashboard)

**Demo Site Token:** `UrlsclickearnCool`

<details>
  <summary><b>Dashboard Screenshots</b></summary>
  <img alt="Analytics" src="./docs/images/urlsclickearn.cool_dashboard.png"/>
  <img alt="Links" src="./docs/images/urlsclickearn.cool_dashboard_links.png"/>
  <img alt="Link Analytics" src="./docs/images/urlsclickearn.cool_dashboard_link_slug.png"/>
</details>

---

## ✨ Features

- **URL Shortening** — Clean, minimal, and customizable slugs
- **Analytics** — Real-time stats for every link
- **Serverless** — Deploys to Cloudflare Workers/Pages, no servers needed
- **Custom Slugs** — Personalized, case-sensitive slugs
- **AI Slug Generation** — Smart, unique slugs with AI
- **Link Expiration** — Set expiry dates for links
- **OpenAPI** — Full API for integration
- **Extensions** — Browser, Raycast, iOS Shortcuts, and more

---

## 🧱 Tech Stack

- **Nuxt 3** — Modern Vue framework
- **Cloudflare Workers & KV** — Serverless compute and storage
- **Cloudflare Analytics Engine** — Built-in analytics
- **Tailwind CSS** — Utility-first styling
- **shadcn-vue** — UI components

---

## 🚀 Quick Start

1. **Clone & Install**
   ```sh
   git clone https://github.com/ccbikai/urlsclickearnultrapro.git
   cd urlsclickearnultrapro
   pnpm install
   ```
2. **Configure**
   - Copy `.env.example` to `.env` and fill in your Cloudflare/Brevo keys.
   - See [docs/configuration.md](./docs/configuration.md) for all options.
3. **Build & Preview**
   ```sh
   pnpm build
   npx nuxthub preview
   ```
4. **Deploy**
   - [Cloudflare Workers](./docs/deployment/workers.md) (recommended)
   - [Cloudflare Pages](./docs/deployment/pages.md)

---

## 🛠️ Configuration & API

- [Configuration Guide](./docs/configuration.md)
- [API Reference](./docs/api.md)

---

## 🗺️ Roadmap & Extensions

- [x] Browser Extension ([Chrome/Edge](https://github.com/zhuzhuyule/urlsclickearn-extension))
- [x] Raycast Extension ([Raycast-Urlsclickearn](https://github.com/foru17/raycast-urlsclickearn))
- [x] iOS Shortcuts ([Apple Shortcuts](https://s.search1api.com/urlsclickearn001))
- [x] iOS App ([App Store](https://apps.apple.com/app/id6745417598))
- [ ] Enhanced Link Management (Cloudflare D1)
- [ ] Analytics: Advanced Filtering
- [ ] Dashboard: Infinite Loading
- [ ] Unit Tests

---

## 🙋 FAQs & Support

- [FAQs](./docs/faqs.md)
- [OpenAPI/MCP Integration](#)

---

## 💖 Credits & Sponsors

- [Cloudflare](https://www.cloudflare.com/)
- [NuxtHub](https://hub.nuxt.com/)
- [Astroship](https://astroship.web3templates.com/)
- [Sponsor on GitHub](https://github.com/sponsors/ccbikai)
- [Follow on X (Twitter)](https://404.li/kai)
