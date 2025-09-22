import { randomInt } from 'node:crypto'
import { getRequestIP, readBody } from 'h3'
import { z } from 'zod'
import { sendResetCodeEmail } from '../../utils/email'
import { findUserByEmail, updateUser } from '../../utils/users-file'

const ResetRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
})

const resetRequestAttempts = new Map<string, { attempts: number, lastAttempt: number }>()
const MAX_RESET_ATTEMPTS = 3
const RESET_REQUEST_WINDOW = 60 * 60 * 1000 // 1 hour

function checkResetRequestRateLimit(identifier: string): boolean {
  const now = Date.now()
  const entry = resetRequestAttempts.get(identifier)

  if (!entry) {
    resetRequestAttempts.set(identifier, { attempts: 1, lastAttempt: now })
    return true
  }

  if (now - entry.lastAttempt > RESET_REQUEST_WINDOW) {
    resetRequestAttempts.set(identifier, { attempts: 1, lastAttempt: now })
    return true
  }

  if (entry.attempts >= MAX_RESET_ATTEMPTS) {
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
    const validationResult = ResetRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid email format',
        data: { errors: validationResult.error.format() },
      })
    }

    const { email } = validationResult.data
    const normalizedEmail = email.toLowerCase().trim()

    // Rate limiting by email and IP
    const rateLimitKey = `${normalizedEmail}:${clientIP}`
    if (!checkResetRequestRateLimit(rateLimitKey)) {
      return createError({
        statusCode: 429,
        statusMessage: 'Too many reset requests. Please try again in 1 hour.',
      })
    }

    // Find user
    const user = await findUserByEmail(normalizedEmail)

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user && user.verified && user.status === 'active') {
      // Generate reset code
      const code = String(100000 + randomInt(900000))
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

      await updateUser({ email: normalizedEmail }, {
        resetCode: code,
        resetExpiresAt: expiresAt,
      })

      try {
        await sendResetCodeEmail(
          normalizedEmail,
          code,
          user.profile?.firstName || undefined,
        )
        console.log(`Password reset requested for: ${normalizedEmail} from ${clientIP}`)
      }
      catch (error) {
        console.error('Failed to send reset email:', error)
        return createError({
          statusCode: 500,
          statusMessage: 'Failed to send reset email. Please try again.',
        })
      }
    }

    return {
      success: true,
      message: 'If an account with this email exists, you will receive a password reset code shortly.',
      data: { email: normalizedEmail },
    }
  }
  catch (error) {
    console.error('Password reset request error:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'An error occurred. Please try again.',
    })
  }
})
