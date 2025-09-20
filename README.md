# ⚡ Urlsclickearn
# ⚡ Urlsclickearn
**A Simple / Speedy / Secure Link Shortener with Analytics, 100% run on Cloudflare.**
    alt="ccbikai/Urlsclickearn | Trendshift"
<a href="https://trendshift.io/repositories/10421" target="_blank">
<a href="https://www.uneed.best/tool/urlsclickearn" target="_blank">
    src="https://trendshift.io/api/badge/repositories/10421"
[<img src="https://devin.ai/assets/deepwiki-badge.png" alt="DeepWiki" height="20"/>](https://deepwiki.com/ccbikai/Urlsclickearn)
    width="250"
Experience the demo at [Urlsclickearn.Cool](https://urlsclickearn.cool/dashboard). Log in using the Site Token below:
  />
Site Token: UrlsclickearnCool
<a href="https://news.ycombinator.com/item?id=40843683" target="_blank">
  <img alt="Analytics" src="./docs/images/urlsclickearn.cool_dashboard.png"/>
  <img alt="Links" src="./docs/images/urlsclickearn.cool_dashboard_links.png"/>
  <img alt="Link Analytics" src="./docs/images/urlsclickearn.cool_dashboard_link_slug.png"/>
    width="250"
      - [Urlsclickearn Tool](https://github.com/zhuzhuyule/urlsclickearn-extension)
      - [Raycast-Urlsclickearn](https://github.com/foru17/raycast-urlsclickearn)
      - [Urlsclickearn Shortcuts](https://s.search1api.com/urlsclickearn001)
      - [Urlsclickearn](https://apps.apple.com/app/id6745417598)
  <img
    "urlsclickearn": {
    alt="Featured｜HelloGitHub"
        "OPENAPI_SPEC_URL": "https://urlsclickearn.cool/_docs/openapi.json",
        "API_KEY": "UrlsclickearnCool",
  />
</a>
<a href="https://www.uneed.best/tool/urlsclickearn" target="_blank">
  <img
    src="https://www.uneed.best/POTW1.png"
    alt="Uneed Badge"
    width="250"
    height="55"
  />
</a>

[<img src="https://devin.ai/assets/deepwiki-badge.png" alt="DeepWiki" height="20"/>](https://deepwiki.com/ccbikai/Urlsclickearn)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F69652?style=flat&logo=cloudflare&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=flat&logo=nuxtdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white)

![Hero](./public/image.png)

----

## ✨ Features

- **URL Shortening:** Compress your URLs to their minimal length.
- **Analytics:** Monitor link analytics and gather insightful statistics.
- **Serverless:** Deploy without the need for traditional servers.
- **Customizable Slug:** Support for personalized slugs and case sensitivity.
- **🪄 AI Slug:** Leverage AI to generate slugs.
- **Link Expiration:** Set expiration dates for your links.

## 🪧 Demo

Experience the demo at [Urlsclickearn.xyz](https://urlsclickearn.xyz/dashboard). Log in using the Site Token below:

```txt
Site Token: UrlsclickearnCool
```

<details>
  <summary><b>Screenshots</b></summary>
  <img alt="Analytics" src="./docs/images/urlsclickearn.xyz_dashboard.png"/>
  <img alt="Links" src="./docs/images/urlsclickearn.xyz_dashboard_links.png"/>
  <img alt="Link Analytics" src="./docs/images/urlsclickearn.xyz_dashboard_link_slug.png"/>
</details>

## 🧱 Technologies Used

- **Framework**: [Nuxt](https://nuxt.com/)
- **Database**: [Cloudflare Workers KV](https://developers.cloudflare.com/kv/)
- **Analytics Engine**: [Cloudflare Workers Analytics Engine](https://developers.cloudflare.com/analytics/)
- **UI Components**: [shadcn-vue](https://www.shadcn-vue.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Cloudflare](https://www.cloudflare.com/)

## 🚗 Roadmap [WIP]

We welcome your contributions and PRs.

- [x] Browser Extension
  - [Urlsclickearn Tool](https://github.com/zhuzhuyule/urlsclickearn-extension)
- [x] Raycast Extension
  - [Raycast-Urlsclickearn](https://github.com/foru17/raycast-urlsclickearn)
- [x] Apple Shortcuts
  - [Urlsclickearn Shortcuts](https://s.search1api.com/urlsclickearn001)
- [x] iOS App
  - [Urlsclickearn](https://apps.apple.com/app/id6745417598)
- [ ] Enhanced Link Management (with Cloudflare D1)
- [ ] Analytics Enhancements (Support for merging filter conditions)
- [ ] Dashboard Performance Optimization (Infinite loading)
- [ ] Units Test

## 🏗️ Deployment

> Video tutorial: [Watch here](https://www.youtube.com/watch?v=MkU23U2VE9E)

We currently support deployment to [Cloudflare Workers](./docs/deployment/workers.md) (recommended) and [Cloudflare Pages](./docs/deployment/pages.md).

## ⚒️ Configuration

[Configuration Docs](./docs/configuration.md)

## 🔌 API

[API Docs](./docs/api.md)

## 🧰 MCP

We currently do not support native MCP Server, but we have OpenAPI documentation, and you can use the following method to support MCP.

> Replace the domain name in `OPENAPI_SPEC_URL` with your own domain name.
>
> The `API_KEY` is the same as the `NUXT_SITE_TOKEN` in the environment variables.

```json
{
  "mcpServers": {
  "urlsclickearn": {
      "command": "uvx",
      "args": [
        "mcp-openapi-proxy"
      ],
      "env": {
  "OPENAPI_SPEC_URL": "https://urlsclickearn.xyz/_docs/openapi.json",
  "API_KEY": "UrlsclickearnCool",
        "TOOL_WHITELIST": "/api/link/create"
      }
    }
  }
}
```

## 🙋🏻 FAQs

[FAQs](./docs/faqs.md)

## 💖 Credits

1. [**Cloudflare**](https://www.cloudflare.com/)
2. [**NuxtHub**](https://hub.nuxt.com/)
3. [**Astroship**](https://astroship.web3templates.com/)

## ☕ Sponsor

1. [Follow Me on X(Twitter)](https://404.li/kai).
2. [Become a sponsor to on GitHub](https://github.com/sponsors/ccbikai).
