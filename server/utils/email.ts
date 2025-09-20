// server/utils/email.ts
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { useRuntimeConfig } from '#imports'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

class EmailService {
  private transporter: Transporter
  private config: any
  private fromAddress: string
  private retryAttempts: number = 3
  private retryDelay: number = 1000

  constructor() {
    this.config = useRuntimeConfig()
    this.fromAddress = this.getFromAddress()
    this.transporter = this.createTransporter()
  }

  private getFromAddress(): string {
    return process.env.SMTP_FROM || 
           this.config?.public?.SMTP_FROM || 
           'Urlsclickearn <no-reply@urlsclickearn.xyz>'
  }

  private createTransporter(): Transporter {
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || this.config?.public?.SMTP_HOST || 'smtp.zoho.in',
      port: Number(process.env.SMTP_PORT || this.config?.public?.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER || this.config?.public?.SMTP_USER || '',
        pass: process.env.SMTP_PASS || this.config?.public?.SMTP_PASS || ''
      }
    }

    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('Email service: SMTP credentials not configured properly')
    }

    return nodemailer.createTransport(emailConfig);
  }

  private async sendWithRetry(
    to: string, 
    template: EmailTemplate, 
    attempt: number = 1
  ): Promise<any> {
    try {
      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text
      })
      
      console.log(`Email sent successfully to ${to}: ${info.messageId}`)
      return info
    } catch (error) {
      console.error(`Email send attempt ${attempt} failed:`, error)
      
      if (attempt < this.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt))
        return this.sendWithRetry(to, template, attempt + 1)
      }
      
      throw error
    }
  }

  private getBaseTemplate(content: string, footer: boolean = true): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
          .code-box { background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .warning { background: #fef2f2; color: #991b1b; padding: 10px; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Urlsclickearn</h1>
          </div>
          <div class="content">
            ${content}
            ${footer ? `
              <div class="footer">
                <p>This is an automated message from Urlsclickearn.</p>
                <p>© ${new Date().getFullYear()} Urlsclickearn. All rights reserved.</p>
                <p>If you didn't request this email, please ignore it or contact support.</p>
              </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `
  }

  async sendVerificationEmail(to: string, code: string, userName?: string): Promise<void> {
    const template: EmailTemplate = {
      subject: '🔐 Verify your Urlsclickearn account',
      html: this.getBaseTemplate(`
        <h2>Welcome${userName ? `, ${userName}` : ''}!</h2>
        <p>Thank you for signing up for Urlsclickearn. To complete your registration, please verify your email address.</p>
        
        <div class="code-box">
          <p style="margin: 0 0 10px 0; color: #6b7280;">Your verification code is:</p>
          <div class="code">${code}</div>
          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">This code will expire in 60 minutes</p>
        </div>
        
        <p><strong>How to verify:</strong></p>
        <ol>
          <li>Go to the verification page</li>
          <li>Enter your email address</li>
          <li>Enter the 6-digit code above</li>
          <li>Click "Verify Account"</li>
        </ol>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong> Never share this code with anyone. Urlsclickearn staff will never ask for your verification code.
        </div>
        
        <p>If you didn't create an account with Urlsclickearn, please ignore this email.</p>
      `),
      text: `Your Urlsclickearn verification code is: ${code}. This code expires in 60 minutes.`
    }
    
    await this.sendWithRetry(to, template)
  }

  async sendWelcomeEmail(to: string, userName?: string): Promise<void> {
    const template: EmailTemplate = {
      subject: '🎉 Welcome to Urlsclickearn!',
      html: this.getBaseTemplate(`
        <h2>Welcome aboard${userName ? `, ${userName}` : ''}! 🚀</h2>
        <p>Your account has been successfully verified and you're all set to start using Urlsclickearn.</p>
        
        <h3>What's next?</h3>
        <ul>
          <li>Complete your profile to get the most out of Urlsclickearn</li>
          <li>Explore our dashboard and features</li>
          <li>Start earning with shortened URLs</li>
          <li>Check out our documentation for tips and best practices</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://urlsclickearn.xyz/dashboard" class="button">Go to Dashboard</a>
        </div>
        
        <h3>Need help?</h3>
        <p>Our support team is here to help you succeed. If you have any questions:</p>
        <ul>
          <li>Email us at: support@urlsclickearn.xyz</li>
          <li>Visit our Help Center</li>
          <li>Join our community forum</li>
        </ul>
        
        <p style="margin-top: 30px;">Best regards,<br>The Urlsclickearn Team</p>
      `),
      text: `Welcome to Urlsclickearn! Your account has been verified. Visit https://urlsclickearn.xyz/dashboard to get started.`
    }
    
    await this.sendWithRetry(to, template)
  }

  async sendResetCodeEmail(to: string, code: string, userName?: string): Promise<void> {
    const template: EmailTemplate = {
      subject: '🔑 Password Reset Code for Urlsclickearn',
      html: this.getBaseTemplate(`
        <h2>Password Reset Request</h2>
        <p>Hello${userName ? ` ${userName}` : ''},</p>
        <p>We received a request to reset your password for your Urlsclickearn account.</p>
        
        <div class="code-box">
          <p style="margin: 0 0 10px 0; color: #6b7280;">Your password reset code is:</p>
          <div class="code">${code}</div>
          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">This code will expire in 60 minutes</p>
        </div>
        
        <p><strong>To reset your password:</strong></p>
        <ol>
          <li>Return to the password reset page</li>
          <li>Enter this 6-digit code</li>
          <li>Create your new password</li>
          <li>Confirm your new password</li>
        </ol>
        
        <div class="warning">
          <strong>⚠️ Important:</strong> If you didn't request a password reset, your account may be at risk. 
          Please secure your account immediately and contact our support team.
        </div>
        
        <p><strong>Password requirements:</strong></p>
        <ul>
          <li>At least 8 characters long</li>
          <li>Contains uppercase and lowercase letters</li>
          <li>Contains at least one number</li>
          <li>Contains at least one special character (recommended)</li>
        </ul>
      `),
      text: `Your password reset code is: ${code}. This code expires in 60 minutes. If you didn't request this, please ignore this email.`
    }
    
    await this.sendWithRetry(to, template)
  }

  async sendPasswordChangedEmail(to: string, userName?: string): Promise<void> {
    const template: EmailTemplate = {
      subject: '✅ Your Urlsclickearn password has been changed',
      html: this.getBaseTemplate(`
        <h2>Password Successfully Changed</h2>
        <p>Hello${userName ? ` ${userName}` : ''},</p>
        <p>This email confirms that your Urlsclickearn account password was successfully changed.</p>
        
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #166534;">✅ Password changed on: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="warning">
          <strong>⚠️ Wasn't you?</strong> If you didn't make this change, your account may be compromised. 
          Please contact our support team immediately at security@urlsclickearn.xyz
        </div>
        
        <h3>Security Tips:</h3>
        <ul>
          <li>Use a unique password for each online account</li>
          <li>Enable two-factor authentication when available</li>
          <li>Never share your password with anyone</li>
          <li>Regularly update your passwords</li>
        </ul>
      `),
      text: `Your Urlsclickearn password has been successfully changed. If you didn't make this change, please contact support immediately.`
    }
    
    await this.sendWithRetry(to, template)
  }

  async sendLoginAlertEmail(to: string, details: { ip?: string, device?: string, location?: string }): Promise<void> {
    const template: EmailTemplate = {
      subject: '🔔 New login to your Urlsclickearn account',
      html: this.getBaseTemplate(`
        <h2>New Login Detected</h2>
        <p>We noticed a new login to your Urlsclickearn account:</p>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          ${details.ip ? `<p><strong>IP Address:</strong> ${details.ip}</p>` : ''}
          ${details.device ? `<p><strong>Device:</strong> ${details.device}</p>` : ''}
          ${details.location ? `<p><strong>Location:</strong> ${details.location}</p>` : ''}
        </div>
        
        <p>If this was you, no action is needed. If you don't recognize this login, please:</p>
        <ol>
          <li>Change your password immediately</li>
          <li>Review your account activity</li>
          <li>Contact our support team</li>
        </ol>
      `),
      text: `New login detected on your Urlsclickearn account. If this wasn't you, please secure your account immediately.`
    }
    
    await this.sendWithRetry(to, template)
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log('Email service: SMTP connection verified successfully')
      return true
    } catch (error) {
      console.error('Email service: SMTP connection failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export convenience functions
export const sendVerificationEmail = (to: string, code: string, userName?: string) => 
  emailService.sendVerificationEmail(to, code, userName)

export const sendWelcomeEmail = (to: string, userName?: string) => 
  emailService.sendWelcomeEmail(to, userName)

export const sendResetCodeEmail = (to: string, code: string, userName?: string) => 
  emailService.sendResetCodeEmail(to, code, userName)

export const sendPasswordChangedEmail = (to: string, userName?: string) => 
  emailService.sendPasswordChangedEmail(to, userName)

export const sendLoginAlertEmail = (to: string, details: any) => 
  emailService.sendLoginAlertEmail(to, details)