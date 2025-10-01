import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const url = event.node?.req?.url || event.req?.url || ''

  // server-side redirects for legacy/top-level routes
  if (url === '/signup') {
    return sendRedirect(event, '/auth/signup', 302)
  }

  if (url === '/login') {
    return sendRedirect(event, '/auth/login', 302)
  }

  if (url === '/reset-password') {
    return sendRedirect(event, '/auth/reset-password', 302)
  }

  if (url === '/auth/reset-request') {
    // keep path but ensure trailing behavior; forward to same path (the page exists)
    return
  }

  if (url === '/dashboard') {
    return sendRedirect(event, '/dashboard/links', 302)
  }
})
