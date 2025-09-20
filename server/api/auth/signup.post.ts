// server/api/auth/signup.post.ts
import { readBody, getRequestIP, getHeader } from 'h3'
import { randomInt } from 'crypto'
import { z } from 'zod'
import { 
  findUserByEmail, 
  createUser, 
  updateUser, 
  userManagement 
} from '../../utils/users-file'
import { sendVerificationEmail } from '../../utils/email'

// Input validation schema
const SignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  marketingEmails: z.boolean().optional()
})

interface SignupRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  acceptTerms: boolean
  marketingEmails?: boolean
}

interface RateLimitEntry {
  attempts: number
  lastAttempt: number
  blocked: boolean
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const MAX_SIGNUP_ATTEMPTS = 3
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)
  
  if (!entry) {
    rateLimitMap.set(identifier, { attempts: 1, lastAttempt: now, blocked: false })
    return true
  }
  
  // Reset if window has passed
  if (now - entry.lastAttempt > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { attempts: 1, lastAttempt: now, blocked: false })
    return true
  }
  
  if (entry.attempts >= MAX_SIGNUP_ATTEMPTS) {
    entry.blocked = true
    return false
  }
  
  entry.attempts++
  entry.lastAttempt = now
  return true
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const clientIP = getRequestIP(event)
    const userAgent = getHeader(event, 'user-agent') || 'Unknown'
    
    // Rate limiting by IP
    if (!checkRateLimit(clientIP || 'unknown')) {
      return createError({
        statusCode: 429,
        statusMessage: 'Too many signup attempts. Please try again in 15 minutes.'
      })
    }
    
    // Validate input
    const validationResult = SignupSchema.safeParse(body)
    if (!validationResult.success) {
      return createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: { errors: validationResult.error.format() }
      })
    }
    
    const { email, password, firstName, lastName, acceptTerms, marketingEmails } = validationResult.data
    const normalizedEmail = email.toLowerCase().trim()
    
    // Additional password validation
    const passwordValidation = await userManagement.validatePassword(password)
    if (!passwordValidation.valid) {
      return createError({
        statusCode: 400,
        statusMessage: 'Password requirements not met',
        data: { errors: passwordValidation.errors }
      })
    }
    
    // Check if user already exists
    const existingUser = await findUserByEmail(normalizedEmail)
    if (existingUser) {
      if (existingUser.verified) {
        return createError({
          statusCode: 409,
          statusMessage: 'An account with this email already exists. Please sign in instead.'
        })
      } else {
        // User exists but not verified - resend verification
        const code = String(100000 + randomInt(900000))
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
        
        await updateUser({ email: normalizedEmail }, {
          verificationCode: code,
          verificationExpiresAt: expiresAt,
          updatedAt: new Date().toISOString()
        })
        
        try {
          await sendVerificationEmail(normalizedEmail, code, firstName || undefined)
        } catch (error) {
          console.error('Failed to send verification email:', error)
          return createError({
            statusCode: 500,
            statusMessage: 'Failed to send verification email. Please try again.'
          })
        }
        
        return {
          success: true,
          message: 'Verification code resent to your email address.',
          data: { email: normalizedEmail, resent: true }
        }
      }
    }
    
    // Hash password
    const passwordHash = await userManagement.hashPassword(password)
    
    // Create user profile
    const profile = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim()
    }
    
    // Create user
    const user = await createUser(normalizedEmail, passwordHash, profile)
    
    // Update settings based on preferences
    await updateUser({ id: user.id }, {
      settings: {
        ...user.settings,
        marketingEmails: marketingEmails || false
      }
    })
    
    // Generate verification code
    const code = String(100000 + randomInt(900000))
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    
    await updateUser({ id: user.id }, {
      verificationCode: code,
      verificationExpiresAt: expiresAt
    })
    
    // Send verification email
    try {
      await sendVerificationEmail(normalizedEmail, code, firstName)
    } catch (error) {
      console.error('Failed to send verification email:', error)
      // Don't fail the signup, but log the error
    }
    
    // Log signup attempt
    console.log(`New user signup: ${normalizedEmail} from ${clientIP}`)
    
    return {
      success: true,
      message: 'Account created successfully! Please check your email for the verification code.',
      data: { 
        email: normalizedEmail,
        userId: user.id,
        verificationRequired: true
      }
    }
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      if (error.message.includes('already exists')) {
        // Handle specific error case
      }
    } else {
      console.error('Unknown error occurred:', error);
    }
    
    return createError({
      statusCode: 500,
      statusMessage: 'An error occurred during signup. Please try again.'
    })
  }
})
