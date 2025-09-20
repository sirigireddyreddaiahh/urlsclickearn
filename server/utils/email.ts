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
    subject: string,
    html: string,
    text?: string
  ): Promise<void> {
    let attempts = 0;
    while (attempts < this.retryAttempts) {
      try {
        await this.transporter.sendMail({
          from: this.fromAddress,
          to,
          subject,
          html,
          text,
        });
        console.log(`Email sent successfully to ${to}`);
        return;
      } catch (error: any) {
        attempts++;
        console.error(
          `Attempt ${attempts} to send email to ${to} failed:`,
          error.message
        );
        if (attempts < this.retryAttempts) {
          console.log(`Retrying in ${this.retryDelay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        } else {
          console.error(`All attempts to send email to ${to} have failed.`);
        }
      }
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

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    const template: EmailTemplate = {
      subject: 'Verify Your Email',
      html: this.getBaseTemplate(`
        <h2>Verify Your Email</h2>
        <p>Your verification code is: <strong>${code}</strong></p>
      `),
      text: `Your Urlsclickearn verification code is: ${code}. This code expires in 60 minutes.`
    };

    await this.sendWithRetry(to, template.subject, template.html, template.text);
  }

  async sendWelcomeEmail(to: string, userName?: string): Promise<void> {
    const template: EmailTemplate = {
      subject: '🎉 Welcome to Urlsclickearn!',
      html: this.getBaseTemplate(`
        <h2>Welcome aboard${userName ? `, ${userName}` : ''}! 🚀</h2>
        <p>Your account has been successfully verified and you're all set to start using Urlsclickearn.</p>
      `),
      text: `Welcome to Urlsclickearn! Your account has been verified. Visit https://urlsclickearn.xyz/dashboard to get started.`
    };

    await this.sendWithRetry(to, template.subject, template.html, template.text);
  }

  async sendResetCodeEmail(to: string, code: string, userName?: string): Promise<void> {
    const template: EmailTemplate = {
      subject: '🔑 Password Reset Code for Urlsclickearn',
      html: this.getBaseTemplate(`
        <h2>Password Reset Request</h2>
        <p>Hello${userName ? ` ${userName}` : ''},</p>
        <p>We received a request to reset your password for your Urlsclickearn account.</p>
      `),
      text: `Your password reset code is: ${code}. This code expires in 60 minutes. If you didn't request this, please ignore this email.`
    };

    await this.sendWithRetry(to, template.subject, template.html, template.text);
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
    
    await this.sendWithRetry(to, template.subject, template.html, template.text)
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
    
    await this.sendWithRetry(to, template.subject, template.html, template.text)
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
export const sendVerificationEmail = (to: string, code: string) => 
  emailService.sendVerificationEmail(to, code);

export const sendWelcomeEmail = (to: string, userName?: string) => 
  emailService.sendWelcomeEmail(to, userName);

export const sendResetCodeEmail = (to: string, code: string, userName?: string) => 
  emailService.sendResetCodeEmail(to, code, userName);

export const sendPasswordChangedEmail = (to: string, userName?: string) => 
  emailService.sendPasswordChangedEmail(to, userName);

export const sendLoginAlertEmail = (to: string, details: any) => 
  emailService.sendLoginAlertEmail(to, details);