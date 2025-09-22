import { createError, defineEventHandler, getRequestIP, readBody } from 'h3'
import { z } from 'zod'
import { sendWelcomeEmail } from '../../utils/email'
import { findUserByEmail, updateUser } from '../../utils/users-file'

const VerifySchema = z.object({
  email: z.string().email('Invalid email format'),
  code: z.string().length(6, 'Verification code must be 6 digits').regex(/^\d{6}$/, 'Invalid code format'),
})

const verificationAttempts = new Map<string, { attempts: number, lastAttempt: number }>()
const MAX_VERIFICATION_ATTEMPTS = 5
const VERIFICATION_WINDOW = 60 * 60 * 1000 // 1 hour

function checkVerificationRateLimit(email: string): boolean {
  const now = Date.now()
  const key = email.toLowerCase()
  const entry = verificationAttempts.get(key)

  if (!entry) {
    verificationAttempts.set(key, { attempts: 1, lastAttempt: now })
    return true
  }

  if (now - entry.lastAttempt > VERIFICATION_WINDOW) {
    verificationAttempts.set(key, { attempts: 1, lastAttempt: now })
    return true
  }

  if (entry.attempts >= MAX_VERIFICATION_ATTEMPTS) {
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

    // Validate input
    const validationResult = VerifySchema.safeParse(body)
    if (!validationResult.success) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid input',
        data: { errors: validationResult.error.format() },
      })
    }

    const { email, code } = validationResult.data
    const normalizedEmail = email.toLowerCase().trim()

    // Rate limiting
    if (!checkVerificationRateLimit(normalizedEmail)) {
      return createError({
        statusCode: 429,
        statusMessage: 'Too many verification attempts. Please try again later.',
      })
    }

    // Find user
    const user = await findUserByEmail(normalizedEmail)
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'User not found. Please sign up first.',
      })
    }

    if (user.verified) {
      return createError({
        statusCode: 400,
        statusMessage: 'Account is already verified. You can sign in now.',
      })
    }

    if (!user.verificationCode || !user.verificationExpiresAt) {
      return createError({
        statusCode: 400,
        statusMessage: 'No verification code found. Please request a new one.',
      })
    }

    // Check if code is expired
    if (new Date() > new Date(user.verificationExpiresAt)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Verification code has expired. Please request a new one.',
      })
    }

    // Verify code
    if (user.verificationCode !== code) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid verification code. Please check your email and try again.',
      })
    }

    // Mark user as verified
    const updatedUser = await updateUser({ email: normalizedEmail }, {
      verified: true,
      verificationCode: undefined,
      verificationExpiresAt: undefined,
      updatedAt: new Date().toISOString(),
    })

    // Clear rate limiting for this user
    verificationAttempts.delete(normalizedEmail)

    // Send welcome email
    try {
      await sendWelcomeEmail(
        normalizedEmail,
        updatedUser.profile?.firstName || undefined,
      )
    }
    catch (error) {
      console.error('Failed to send welcome email:', error)
      // Don't fail verification for email issues
    }

    console.log(`User verified: ${normalizedEmail} from ${clientIP}`)

    return {
      success: true,
      message: 'Email verified successfully! You can now sign in to your account.',
      data: {
        email: normalizedEmail,
        verified: true,
        userId: updatedUser.id,
      },
    }
  }
  catch (error) {
    console.error('Verification error:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'An error occurred during verification. Please try again.',
    })
  }
})
