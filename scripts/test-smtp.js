 import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

async function verifySMTP() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // SMTP username
      pass: process.env.SMTP_PASS, // SMTP password
    },
  })

  try {
    await transporter.verify()
    console.log('SMTP connection verified successfully')
  }
  catch (error) {
    console.error('SMTP connection failed:', error)
  }
}

verifySMTP()
