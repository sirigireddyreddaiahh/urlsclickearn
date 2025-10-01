export default defineNuxtRouteMiddleware(async (to) => {
  // import.meta.server is available at runtime in Nuxt; guard for TS
  // Detect runtime server flag without using TypeScript suppression comments
  const isServer = typeof import.meta !== 'undefined' && (import.meta as any)?.server === true
  if (isServer)
    return

  if (to.path.startsWith('/dashboard/links') && to.path !== '/dashboard/auth/login') {
    if (!window.localStorage.getItem('SinkSiteToken'))
      return navigateTo('/dashboard/auth/login')
  }

  if (to.path === '/dashboard/auth/login') {
    try {
      await useAPI('/api/verify')
      return navigateTo('/dashboard/links')
    }
    catch (e) {
      console.warn(e)
    }
  }
})

