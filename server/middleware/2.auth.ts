import jwt from 'jsonwebtoken'
import { getCookie } from 'h3'
import { userManagement, findUserById } from '../utils/users-file'

const JWT_SECRET = process.env.NUXT_JWT_SECRET || 'dev-jwt-secret-change-in-production'
const SITE_TOKEN = process.env.NUXT_SITE_TOKEN

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/api/auth/signup',
  '/api/auth/verify', 
  '/api/auth/login',
  '/api/auth/request-reset',
  '/api/auth/reset',
  '/api/auth/logout',
  '/api/health',
  '/api/public'
]

// Admin-only endpoints that require site token
const ADMIN_ENDPOINTS = [
  '/api/admin',
  '/api/settings'
]

export default defineEventHandler(async (event) => {
  const url = event.node?.req?.url || event.req?.url || ''
  
  // Skip authentication for public endpoints
  if (PUBLIC_ENDPOINTS.some(endpoint => url.startsWith(endpoint))) {
    return
  }
  
  // Skip for non-API routes (pages, assets, etc.)
  if (!url.startsWith('/api/')) {
    return
  }
  
  const req = event.node?.req || event.req
  const authHeader = req.headers?.authorization || ''
  const cookieHeader = req.headers?.cookie || ''
  
  try {
    // Method 1: Check for admin site token (legacy support)
    if (authHeader.startsWith('Bearer ') && SITE_TOKEN) {
      const token = authHeader.slice(7)
      if (token === SITE_TOKEN) {
        // Admin authenticated - attach admin context
        event.context = {
          ...event.context,
          auth: {
            type: 'admin',
            token: token
          }
        }
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
  }
})