import { getRequestIP, readBody } from 'h3'
import { z } from 'zod'
import { sendPasswordChangedEmail } from '../../utils/email'
import { findUserByEmail, updateUser, userManagement } from '../../utils/users-file'

const ResetSchema = z.object({
  email: z.string().email('Invalid email format'),
  code: z.string().length(6, 'Reset code must be 6 digits').regex(/^\d{6}$/, 'Invalid code format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
})

const resetAttempts = new Map<string, { attempts: number, lastAttempt: number }>()
const MAX_RESET_CODE_ATTEMPTS = 5
const RESET_ATTEMPT_WINDOW = 60 * 60 * 1000 // 1 hour

function checkResetCodeRateLimit(email: string): boolean {
  const now = Date.now()
  const key = email.toLowerCase()
  const entry = resetAttempts.get(key)

  if (!entry) {
    resetAttempts.set(key, { attempts: 1, lastAttempt: now })
    return true
  }

  if (now - entry.lastAttempt > RESET_ATTEMPT_WINDOW) {
    resetAttempts.set(key, { attempts: 1, lastAttempt: now })
    return true
  }

  if (entry.attempts >= MAX_RESET_CODE_ATTEMPTS) {
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
    const validationResult = ResetSchema.safeParse(body)
    if (!validationResult.success) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid input',
        data: { errors: validationResult.error.format() },
      })
    }

    const { email, code, password } = validationResult.data
    const normalizedEmail = email.toLowerCase().trim()

    // Rate limiting
    if (!checkResetCodeRateLimit(normalizedEmail)) {
      return createError({
        statusCode: 429,
        statusMessage: 'Too many reset attempts. Please try again later.',
      })
    }

    // Validate new password
    const passwordValidation = await userManagement.validatePassword(password)
    if (!passwordValidation.valid) {
      return createError({
        statusCode: 400,
        statusMessage: 'Password requirements not met',
        data: { errors: passwordValidation.errors },
      })
    }

    // Find user
    const user = await findUserByEmail(normalizedEmail)
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'Invalid reset code or user not found.',
      })
    }

    if (!user.resetCode || !user.resetExpiresAt) {
      return createError({
        statusCode: 400,
        statusMessage: 'No password reset request found. Please request a new reset code.',
      })
    }

    // Check if code is expired
    if (new Date() > new Date(user.resetExpiresAt)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Reset code has expired. Please request a new one.',
      })
    }

    // Verify reset code
    if (user.resetCode !== code) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid reset code. Please check your email and try again.',
      })
    }

    // Check if new password is same as current
    const isSamePassword = await userManagement.verifyPassword(password, user.passwordHash)
    if (isSamePassword) {
      return createError({
        statusCode: 400,
        statusMessage: 'New password must be different from your current password.',
      })
    }

    // Hash new password
    const newPasswordHash = await userManagement.hashPassword(password)

    // Update user password and clear reset code
    await updateUser({ email: normalizedEmail }, {
      passwordHash: newPasswordHash,
      resetCode: undefined,
      resetExpiresAt: undefined,
      failedLoginAttempts: 0,
      lockedUntil: undefined,
      updatedAt: new Date().toISOString(),
    })

    // Invalidate all existing sessions for security
    await userManagement.removeUserSessions(user.id)

    // Clear rate limiting for this user
    resetAttempts.delete(normalizedEmail)

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(
        normalizedEmail,
        user.profile?.firstName || undefined,
      )
    }
    catch (error) {
      console.error('Failed to send password changed email:', error)
    }

    console.log(`Password reset completed for: ${normalizedEmail} from ${clientIP}`)

    return {
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.',
      data: {
        email: normalizedEmail,
        resetComplete: true,
      },
    }
  }
  catch (error) {
    console.error('Password reset error:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'An error occurred during password reset. Please try again.',
    })
  }
})
