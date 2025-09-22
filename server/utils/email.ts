// server/utils/email.ts
import { sendEmail } from './sendEmail'

// Send verification email
export async function sendVerificationEmail(to: string, code: string, firstName?: string) {
  const subject = 'Verify your email address'
  const htmlContent = `
    <p>Hi${firstName ? ` ${firstName}` : ''},</p>
    <p>Your verification code is: <b>${code}</b></p>
    <p>Enter this code in the app to verify your email address.</p>
    <p>If you did not request this, you can ignore this email.</p>
  `
  await sendEmail({ to, subject, htmlContent })
}

// Send welcome email
export async function sendWelcomeEmail(to: string, firstName?: string) {
  const subject = 'Welcome to Urlsclickearn!'
  const htmlContent = `
    <p>Hi${firstName ? ` ${firstName}` : ''},</p>
    <p>Welcome to Urlsclickearn! Your account is now active.</p>
    <p>Thank you for joining us.</p>
  `
  await sendEmail({ to, subject, htmlContent })
}

// Send password reset code email
export async function sendResetCodeEmail(to: string, code: string, firstName?: string) {
  const subject = 'Password Reset Code'
  const htmlContent = `
    <p>Hi${firstName ? ` ${firstName}` : ''},</p>
    <p>Your password reset code is: <b>${code}</b></p>
    <p>Enter this code in the app to reset your password.</p>
    <p>If you did not request this, you can ignore this email.</p>
  `
  await sendEmail({ to, subject, htmlContent })
}

// Send password changed notification
export async function sendPasswordChangedEmail(to: string, firstName?: string) {
  const subject = 'Your password was changed'
  const htmlContent = `
    <p>Hi${firstName ? ` ${firstName}` : ''},</p>
    <p>Your password was successfully changed. If you did not perform this action, please contact support immediately.</p>
  `
  await sendEmail({ to, subject, htmlContent })
}
