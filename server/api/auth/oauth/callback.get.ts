import { defineEventHandler, getHeader, getRequestIP, setCookie } from 'h3'
import * as jwt from 'jsonwebtoken'
import { createUser, findUserByEmail, updateUser, userManagement } from '../../../utils/users-file'

// OAuth callback handler: /api/auth/oauth/callback?provider=github|google&code=...
// This implementation exchanges the code for tokens, fetches the profile, then creates/links a user,
// issues a JWT, creates a session record and sets an httpOnly cookie so the user is logged in.

const JWT_SECRET = process.env.NUXT_JWT_SECRET || 'dev-jwt-secret-change-in-production'
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function buildRedirectUrl(origin: string, provider: string) {
  return `${origin}/api/auth/oauth/callback?provider=${provider}`
}

export default defineEventHandler(async (event) => {
  try {
    const url = new URL(event.node.req.url || '', `http://${event.node.req.headers.host}`)
    const provider = url.searchParams.get('provider')
    const code = url.searchParams.get('code')

    if (!provider || !code) {
      return { error: true, message: 'Missing provider or code' }
    }

    const origin = process.env.OAUTH_BASE_URL || `http://localhost:${process.env.PORT || 3000}`
    const clientIP = getRequestIP(event)
    const userAgent = getHeader(event, 'user-agent') || 'unknown'

    // Helper to finalize login: create session, set cookie, redirect
    async function finalizeLogin(userId: string) {
      const token = jwt.sign({ sub: userId }, JWT_SECRET as any, { expiresIn: TOKEN_EXPIRES_IN } as any)
      await userManagement.createSession(userId, token, clientIP || undefined, userAgent)
      setCookie(event, 'urlsclickearn_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === 'production',
      })
      // Redirect to dashboard
      return { success: true, redirect: '/dashboard' }
    }

    // --- GitHub flow ---
    if (provider === 'github') {
      const clientId = process.env.GITHUB_CLIENT_ID
      const clientSecret = process.env.GITHUB_CLIENT_SECRET
      if (!clientId || !clientSecret)
        return { error: true, message: 'GitHub client credentials not configured' }

      // Exchange code for token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      })
      const tokenJson = await tokenRes.json()
      if (!tokenJson.access_token)
        return { error: true, message: 'Failed to obtain GitHub access token', details: tokenJson }

      // Fetch user profile and emails
      const profileRes = await fetch('https://api.github.com/user', { headers: { Authorization: `token ${tokenJson.access_token}`, Accept: 'application/vnd.github.v3+json' } })
      const profile = await profileRes.json()
      const emailsRes = await fetch('https://api.github.com/user/emails', { headers: { Authorization: `token ${tokenJson.access_token}`, Accept: 'application/vnd.github.v3+json' } })
      const emails = await emailsRes.json()
      const primary = Array.isArray(emails) ? emails.find((e: any) => e.primary && e.verified) : null
      const email = primary?.email || profile.email
      if (!email)
        return { error: true, message: 'No verified email returned from GitHub' }

      // Find or create user
      const normalizedEmail = String(email).toLowerCase().trim()
      const user = await findUserByEmail(normalizedEmail)
      if (user) {
        // Link provider if not linked
        const providerMeta = user.metadata || {}
        providerMeta.oauthProviders = providerMeta.oauthProviders || []
        if (!providerMeta.oauthProviders.find((p: any) => p.provider === 'github' && p.id === String(profile.id))) {
          providerMeta.oauthProviders.push({ provider: 'github', id: String(profile.id) })
          await updateUser({ id: user.id }, { metadata: providerMeta, verified: true })
        }
        return finalizeLogin(user.id)
      }

      // Create a new user
      const pwHash = await userManagement.hashPassword(String(Math.random()))
      const newUser = await createUser(normalizedEmail, pwHash, { firstName: profile.name || undefined })
      await updateUser({ id: newUser.id }, { verified: true, metadata: { oauthProviders: [{ provider: 'github', id: String(profile.id) }] } })
      return finalizeLogin(newUser.id)
    }

    // --- Google flow ---
    if (provider === 'google') {
      const clientId = process.env.GOOGLE_CLIENT_ID
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET
      const redirectUri = buildRedirectUrl(origin, 'google')
      if (!clientId || !clientSecret)
        return { error: true, message: 'Google client credentials not configured' }

      // Exchange code for tokens
      const params = new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' })
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() })
      const tokenJson = await tokenRes.json()
      if (!tokenJson.access_token)
        return { error: true, message: 'Failed to obtain Google access token', details: tokenJson }

      // Fetch userinfo
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${tokenJson.access_token}` } })
      const profile = await profileRes.json()

      if (!profile || !profile.email)
        return { error: true, message: 'Failed to read profile from Google' }
      if (!profile.email_verified)
        return { error: true, message: 'Google account email is not verified' }

      const normalizedEmail = String(profile.email).toLowerCase().trim()
      const user = await findUserByEmail(normalizedEmail)
      if (user) {
        // Link provider if not linked
        const providerMeta = user.metadata || {}
        providerMeta.oauthProviders = providerMeta.oauthProviders || []
        if (!providerMeta.oauthProviders.find((p: any) => p.provider === 'google' && p.id === String(profile.sub || profile.id))) {
          providerMeta.oauthProviders.push({ provider: 'google', id: String(profile.sub || profile.id) })
          await updateUser({ id: user.id }, { metadata: providerMeta, verified: true })
        }
        return finalizeLogin(user.id)
      }

      // Create new user
      const pwHash = await userManagement.hashPassword(String(Math.random()))
      const newUser = await createUser(normalizedEmail, pwHash, { firstName: profile.given_name || profile.name || undefined, lastName: profile.family_name || undefined })
      await updateUser({ id: newUser.id }, { verified: true, metadata: { oauthProviders: [{ provider: 'google', id: String(profile.sub || profile.id) }] } })
      return finalizeLogin(newUser.id)
    }

    return { error: true, message: `Unsupported provider: ${provider}` }
  }
  catch (err: any) {
    console.error('OAuth callback error:', err)
    return { error: true, message: 'OAuth callback failed', details: err && err.message }
  }
})
