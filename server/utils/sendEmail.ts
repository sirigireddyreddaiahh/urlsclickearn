// server/utils/sendEmail.ts
// Utility to send emails using Brevo Transactional Email API

export interface SendEmailOptions {
  to: string
  subject: string
  htmlContent: string
  senderName?: string
  senderEmail?: string
}

export async function sendEmail({
  to,
  subject,
  htmlContent,
  senderName = 'Urlsclickearn',
  senderEmail = 'admin.rs@urlsclickearn.xyz',
}: SendEmailOptions) {
  const apiKey = process.env.BREVO_API_KEY

  // Dev fallback: if no API key is provided, don't throw — log the email and return a stub.
  if (!apiKey) {
    // Keep behavior non-blocking in development so signup flows don't fail.
    console.warn('BREVO_API_KEY not set — running in dev fallback mode. Email not sent.')
    console.log('--- Dev Email Log ---')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('HTML:', htmlContent)
    console.log('----------------------')
    return { success: true, mocked: true, message: 'Email logged in dev (BREVO_API_KEY missing)' } as any
  }

  // Basic sanity check for the API key shape to catch accidental paste mistakes.
  if (typeof apiKey !== 'string' || apiKey.trim().length < 20 || apiKey.includes(' ')) {
    const msg = `BREVO_API_KEY looks invalid (length=${apiKey ? apiKey.length : 0}).`
    console.warn(msg)
    // In strict mode we treat this as an error; otherwise continue and let API return a proper error.
    if (process.env.BREVO_STRICT === '1') {
      throw new Error(msg)
    }
  }

  // Use AbortController to add a reasonable timeout for the Brevo call.
  const timeoutMs = Number.parseInt(process.env.BREVO_TIMEOUT_MS || '5000', 10)
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
  let timeoutId: NodeJS.Timeout | null = null
  if (controller) {
    timeoutId = setTimeout(() => controller.abort(), timeoutMs) as unknown as NodeJS.Timeout
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
      signal: controller ? controller.signal : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      const errMsg = `Brevo API error: ${response.status} ${response.statusText} - ${errorText}`
      console.error(errMsg)
      // Default behaviour: throw so existing callers' try/catch logic still works.
      // Set BREVO_NON_STRICT=1 to return a structured non-throwing response instead (useful in some dev setups).
      if (process.env.BREVO_NON_STRICT === '1') {
        return { success: false, error: errMsg } as any
      }
      throw new Error(errMsg)
    }

    const data = await response.json()
    return { success: true, data } as any
  }
  catch (err: any) {
    // Catch fetch/network/abort errors and return structured info instead of throwing by default.
    const isAbort = err && err.name === 'AbortError'
    const errMsg = isAbort ? `Brevo request timed out after ${timeoutMs}ms` : `Brevo request failed: ${err && err.message ? err.message : String(err)}`
    console.error(errMsg)
    // Default: re-throw so callers can handle the error (matches previous behavior).
    if (process.env.BREVO_NON_STRICT === '1') {
      return { success: false, error: errMsg } as any
    }
    throw new Error(errMsg)
  }
  finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}
