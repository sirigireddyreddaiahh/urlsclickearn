import { readBody, setCookie, getRequestIP, getHeader } from 'h3'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { findUserByEmail, updateUser, userManagement } from '../../utils/users-file'
import { sendLoginAlertEmail } from '../../utils/email'

const JWT_SECRET = process.env.NUXT_JWT_SECRET || 'dev-jwt-secret-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
  deviceName: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const clientIP = getRequestIP(event)
    const userAgent = getHeader(event, 'user-agent') || 'Unknown Device'
    
    // Validate input
    const validationResult = LoginSchema.safeParse(body)
    if (!validationResult.success) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid input',
        data: { errors: validationResult.error.format() }
      })
    }
    
    const { email, password, rememberMe, deviceName } = validationResult.data
    const normalizedEmail = email.toLowerCase().trim()
    
    // Check if account is locked
    const isLocked = await userManagement.checkAccountLocked(normalizedEmail)
    if (isLocked) {
      await userManagement.recordLoginAttempt(normalizedEmail, false, clientIP || 'unknown', userAgent)
      return createError({
        statusCode: 423,
        statusMessage: 'Account temporarily locked due to multiple failed login attempts. Please try again later or reset your password.'
      })
    }
    
    // Find user
    const user = await findUserByEmail(normalizedEmail)
    if (!user) {
      await userManagement.recordLoginAttempt(normalizedEmail, false, clientIP || 'unknown', userAgent)
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      })
    }
    
    if (user.status !== 'active') {
      await userManagement.recordLoginAttempt(normalizedEmail, false, clientIP || 'unknown', userAgent)
      return createError({
        statusCode: 403,
        statusMessage: 'Account is suspended. Please contact support.'
      })
    }
    
    if (!user.verified) {
      await userManagement.recordLoginAttempt(normalizedEmail, false, clientIP || 'unknown', userAgent)
      return createError({
        statusCode: 403,
        statusMessage: 'Please verify your email address before signing in.'
      })
    }
    
    // Verify password
    const isValidPassword = await userManagement.verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      await userManagement.recordLoginAttempt(normalizedEmail, false, clientIP || 'unknown', userAgent)
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password.'
      })
    }
    
    // Successful login - record it
    await userManagement.recordLoginAttempt(normalizedEmail, true, clientIP || 'unknown', userAgent)
    
    // Update user login info
    const loginCount = user.loginCount + 1
    await updateUser({ email: normalizedEmail }, {
      lastLogin: new Date().toISOString(),
      lastLoginIp: clientIP || undefined,
      loginCount,
      failedLoginAttempts: 0,
      lockedUntil: undefined
    })
    
    // Create JWT token
    const tokenExpiry = rememberMe ? '30d' : JWT_EXPIRES_IN
    const token = jwt.sign(
      { 
        sub: user.id,
        email: user.email,
        role: user.role,
        verified: user.verified,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: tokenExpiry }
    )
    
    // Create session record
    await userManagement.createSession(user.id, token, clientIP, userAgent)
    
    // Set HTTP-only cookie
    const cookieMaxAge = rememberMe 
      ? 30 * 24 * 60 * 60 // 30 days
      : 7 * 24 * 60 * 60  // 7 days
    
    setCookie(event, 'urlsclickearn_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: cookieMaxAge,
      secure: process.env.NODE_ENV === 'production'
    })
    
    // Send login alert if enabled and this is a new device/location
    if (user.settings?.loginAlerts && loginCount > 1) {
      try {
        await sendLoginAlertEmail(user.email, {
          ip: clientIP,
          device: deviceName || userAgent,
          location: 'Unknown' // Could integrate with IP geolocation service
        })
      } catch (error) {
        console.error('Failed to send login alert:', error)
      }
    }
    
    console.log(`User login: ${normalizedEmail} from ${clientIP}`)
    
    return {
      success: true,
      message: 'Signed in successfully!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile,
          role: user.role,
          lastLogin: user.lastLogin,
          loginCount: loginCount
        },
        session: {
          expiresIn: tokenExpiry,
          rememberMe: rememberMe || false
        }
      }
    }
    
  } catch (error) {
    console.error('Login error:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'An error occurred during sign in. Please try again.'
    })
  }
})