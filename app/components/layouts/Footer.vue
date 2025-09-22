<script setup>
import { BloggerIcon, GitHubIcon, GmailIcon, MastodonIcon, TelegramIcon, XIcon } from 'vue3-simple-icons'

const { title, email, telegram, blog, twitter, mastodon, github } = useAppConfig()
const currentYear = new Date().getFullYear()

// Social media links configuration for better maintainability
const socialLinks = computed(() => [
  {
    href: `mailto:${email}`,
    title: 'Email',
    icon: GmailIcon,
    show: !!email,
    color: 'hover:text-red-500',
    label: 'layouts.footer.social.email',
  },
  {
    href: telegram,
    title: 'Telegram',
    icon: TelegramIcon,
    show: !!telegram,
    color: 'hover:text-blue-500',
    label: 'layouts.footer.social.telegram',
    external: true,
  },
  {
    href: blog,
    title: 'Blog',
    icon: BloggerIcon,
    show: !!blog,
    color: 'hover:text-orange-500',
    label: 'layouts.footer.social.blog',
    external: true,
  },
  {
    href: twitter,
    title: 'Twitter',
    icon: XIcon,
    show: !!twitter,
    color: 'hover:text-slate-900 dark:hover:text-white',
    label: 'layouts.footer.social.twitter',
    external: true,
  },
  {
    href: mastodon,
    title: 'Mastodon',
    icon: MastodonIcon,
    show: !!mastodon,
    color: 'hover:text-purple-500',
    label: 'layouts.footer.social.mastodon',
    external: true,
  },
  {
    href: github,
    title: 'GitHub',
    icon: GitHubIcon,
    show: !!github,
    color: 'hover:text-slate-900 dark:hover:text-white',
    label: 'layouts.footer.social.github',
    external: true,
  },
].filter(link => link.show))
</script>

<template>
  <footer class="relative bg-gradient-to-t from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 border-t border-slate-200/50 dark:border-slate-700/50">
    <!-- Decorative top border -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

    <section class="md:pt-8">
      <div class="container flex flex-col items-center py-8 mx-auto sm:flex-row max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Logo and Brand Section -->
        <div class="flex-shrink-0 mb-6 sm:mb-0">
          <NuxtLink
            to="https://urlsclickearn.xyz"
            class="group flex items-center space-x-3 text-xl font-black leading-none text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
            :title="title"
            external
          >
            <!-- Enhanced logo with gradient background -->
            <div class="relative">
              <div class="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/sink.png"
                  :alt="title"
                  class="w-8 h-8 rounded-lg"
                  loading="lazy"
                >
              </div>
              <!-- Animated ring on hover -->
              <div class="absolute inset-0 rounded-xl ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300 opacity-0 group-hover:opacity-100" />
            </div>

            <!-- Brand name with gradient text -->
            <span class="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent font-extrabold tracking-tight">
              {{ title }}
            </span>
          </NuxtLink>
        </div>

        <!-- Copyright Section -->
        <div class="flex-1 text-center sm:text-left sm:ml-6 sm:pl-6 sm:border-l sm:border-slate-200/50 dark:sm:border-slate-700/50">
          <a
            href="https://html.zone"
            target="_blank"
            rel="noopener noreferrer"
            title="HTML.ZONE - Web Development Solutions"
            class="inline-block text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
          >
            <span class="inline-flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd" />
              </svg>
              <span>&copy; {{ currentYear }} Products of HTML.ZONE</span>
            </span>
          </a>
        </div>

        <!-- Social Media Links Section -->
        <div class="flex items-center justify-center mt-6 sm:mt-0 sm:ml-auto">
          <div class="flex space-x-4">
            <template v-for="link in socialLinks" :key="link.title">
              <a
                :href="link.href"
                :title="link.title"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noopener noreferrer' : undefined"
                class="group relative p-2 text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                :class="link.color"
              >
                <!-- Screen reader text -->
                <span class="sr-only">{{ link.title }}</span>

                <!-- Icon with enhanced styling -->
                <component
                  :is="link.icon"
                  class="w-6 h-6 transition-all duration-300 group-hover:drop-shadow-lg"
                />

                <!-- Hover effect background -->
                <div class="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform scale-0 group-hover:scale-100" />

                <!-- Ripple effect on click -->
                <div class="absolute inset-0 rounded-full bg-current opacity-0 group-active:opacity-20 transition-opacity duration-150 transform scale-0 group-active:scale-125" />
              </a>
            </template>
          </div>
        </div>
      </div>

      <!-- Additional Footer Content -->
      <div class="border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
        <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div class="mb-2 sm:mb-0">
              Built with ❤️ using Nuxt.js, Vue.js & Tailwind CSS
            </div>
            <div class="flex space-x-4">
              <NuxtLink
                to="/privacy"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                Privacy
              </NuxtLink>
              <NuxtLink
                to="/terms"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                Terms
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                Contact
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </footer>
</template>

<style scoped>
/* Enhanced animations and transitions */
.group:hover .transform {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom gradient text animation */
@keyframes gradient-x {
  0%, 100% {
    background-size: 200% 200%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.bg-clip-text {
  background-clip: text;
  -webkit-background-clip: text;
}

/* Smooth hover transitions for social icons */
.group:hover {
  transform-origin: center;
}

/* Enhanced focus states for accessibility */
.group:focus {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* Improved mobile responsive design */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Brand colors */
.brand-gradient {
  background: linear-gradient(135deg, #FF6B35 0%, #F72B7E 100%);
}

.footer-dark {
  background: #1a1a1a;
  color: #fff;
}

.footer-link {
  color: #333333;
}

@media (prefers-color-scheme: dark) {
  .footer-link {
    color: #f8f9fa;
  }
}
</style>
