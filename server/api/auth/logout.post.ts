import { getCookie, setCookie, getHeader } from 'h3'
import jwt from 'jsonwebtoken'
import { userManagement } from '../../utils/users-file'

const JWT_SECRET = process.env.NUXT_JWT_SECRET || 'dev-jwt-secret-change-in-production'

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'urlsclickearn_token')
    
    if (token) {
      try {
        // Verify token and remove session
        const decoded = jwt.verify(token, JWT_SECRET) as any
        await userManagement.removeSession(token)
        console.log(`User logged out: ${decoded.email}`)
      } catch (error) {
        console.error('Error during logout:', error)
      }
    }
    
    // Clear the cookie
    setCookie(event, 'urlsclickearn_token', '', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      secure: process.env.NODE_ENV === 'production'
    })
    
    return {
      success: true,
      message: 'Signed out successfully'
    }
    
  } catch (error) {
    console.error('Logout error:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'An error occurred during sign out'
    })
  }
})