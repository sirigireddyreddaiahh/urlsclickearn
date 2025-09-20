<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Ellipsis, X, Menu } from 'lucide-vue-next'
import { GitHubIcon } from 'vue3-simple-icons'

const showMenu = ref(false)
const isScrolled = ref(false)
const { title, github } = useAppConfig()

// Enhanced scroll detection for dynamic header styling
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// Close mobile menu when clicking outside
const closeMenuOnClickOutside = (event) => {
  if (!event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
    showMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', closeMenuOnClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', closeMenuOnClickOutside)
})

// Close menu when route changes
watch(() => useRoute().path, () => {
  showMenu.value = false
})
</script>

<template>
  <header 
    class="sticky top-0 z-50 transition-all duration-300 ease-in-out"
    :class="[
      isScrolled 
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg' 
        : 'bg-transparent'
    ]"
  >
    <section class="pb-6">
      <nav class="container relative z-50 h-20 select-none">
        <div class="container relative flex flex-wrap items-center justify-between h-20 px-4 mx-auto overflow-hidden font-medium lg:justify-center">
          
          <!-- Logo Section with enhanced styling -->
          <div class="flex items-center justify-start w-1/4 h-full pr-4">
            <NuxtLink
              to="/"
              :title="title"
              class="flex items-center py-4 space-x-3 text-xl font-black text-slate-900 dark:text-slate-100 md:py-0 group transition-all duration-300 hover:scale-105"
            >
              <div class="relative">
                <span class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <img
                    src="/sink.png"
                    :alt="title"
                    class="w-8 h-8 rounded-lg"
                    loading="eager"
                  >
                </span>
                <!-- Animated ring on hover -->
                <div class="absolute inset-0 rounded-xl ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300 animate-pulse opacity-0 group-hover:opacity-100"></div>
              </div>
              <span class="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent font-extrabold tracking-tight">
                {{ title }}
              </span>
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center w-3/4 h-full">
            <div class="flex-col w-full h-auto overflow-hidden rounded-lg md:overflow-visible md:rounded-none md:relative md:flex md:flex-row">
              
              <div class="w-auto mx-4" />
              
              <div class="flex flex-row items-center justify-end w-full space-x-6">
                <!-- Dashboard Link -->
                <NuxtLink
                  to="/dashboard"
                  :title="`${title} Dashboard`"
                  class="relative px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium group"
                >
                  <span class="relative z-10">{{ $t('dashboard.title') }}</span>
                  <!-- Animated underline -->
                  <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                </NuxtLink>

                <!-- Signup/Login Buttons -->
                <NuxtLink
                  to="/auth/signup"
                  class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300"
                >
                  Signup
                </NuxtLink>
                <NuxtLink
                  to="/auth/login"
                  class="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  Login
                </NuxtLink>

                <!-- GitHub Link with enhanced styling -->
                <a
                  :href="github"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub Repository"
                  class="inline-flex items-center px-4 py-2 text-sm font-semibold leading-5 text-white bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group"
                >
                  <GitHubIcon class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span>GitHub</span>
                  <!-- Shine effect -->
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine"></div>
                </a>

                <!-- Language and Theme Switches -->
                <div class="flex items-center space-x-3">
                  <SwitchLanguage />
                  <SwitchTheme />
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="menu-button md:hidden relative flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @click="showMenu = !showMenu"
            :aria-expanded="showMenu"
            aria-label="Toggle navigation menu"
          >
            <!-- Animated hamburger icon -->
            <div class="flex flex-col justify-center items-center w-6 h-6 space-y-1">
              <span 
                class="block h-0.5 w-5 bg-slate-600 dark:bg-slate-300 transition-all duration-300"
                :class="showMenu ? 'rotate-45 translate-y-1.5' : ''"
              ></span>
              <span 
                class="block h-0.5 w-5 bg-slate-600 dark:bg-slate-300 transition-all duration-300"
                :class="showMenu ? 'opacity-0' : ''"
              ></span>
              <span 
                class="block h-0.5 w-5 bg-slate-600 dark:bg-slate-300 transition-all duration-300"
                :class="showMenu ? '-rotate-45 -translate-y-1.5' : ''"
              ></span>
            </div>
          </button>
        </div>

        <!-- Mobile Navigation Menu -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 transform -translate-y-4"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform -translate-y-4"
        >
          <div
            v-show="showMenu"
            class="mobile-menu md:hidden absolute top-full left-0 right-0 mt-2 mx-4"
          >
            <div class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden">
              <!-- Mobile Logo -->
              <div class="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <NuxtLink
                  to="/"
                  :title="title"
                  class="flex items-center space-x-3 text-lg font-bold text-slate-900 dark:text-slate-100"
                >
                  <img src="/sink.png" :alt="title" class="w-8 h-8 rounded-lg">
                  <span>{{ title }}</span>
                </NuxtLink>
              </div>

              <!-- Mobile Menu Items -->
              <div class="p-4 space-y-2">
                <NuxtLink
                  to="/dashboard"
                  :title="`${title} Dashboard`"
                  class="flex items-center w-full px-4 py-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 font-medium"
                >
                  {{ $t('dashboard.title') }}
                </NuxtLink>

                <NuxtLink
                  to="/auth/signup"
                  class="flex items-center w-full px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 font-medium"
                >
                  Signup
                </NuxtLink>
                <NuxtLink
                  to="/auth/login"
                  class="flex items-center w-full px-4 py-3 text-white bg-gray-600 hover:bg-gray-700 rounded-xl transition-all duration-300 font-medium"
                >
                  Login
                </NuxtLink>

                <NuxtLink
                  to="/auth/reset-password"
                  class="flex items-center w-full px-4 py-3 text-blue-600 hover:text-blue-700 underline transition-all duration-300"
                >
                  Forgot Password?
                </NuxtLink>

                <a
                  :href="github"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub Repository"
                  class="flex items-center w-full px-4 py-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 font-medium"
                >
                  <GitHubIcon class="w-5 h-5 mr-3" />
                  GitHub
                </a>

                <!-- Mobile Controls -->
                <div class="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Settings</span>
                  <div class="flex items-center space-x-3">
                    <SwitchLanguage />
                    <SwitchTheme />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </nav>
    </section>
  </header>
</template>

<style scoped>
/* Custom animations */
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shine {
  animation: shine 0.6s ease-out;
}

/* Enhanced backdrop blur for better browser support */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom focus styles */
.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}
</style>