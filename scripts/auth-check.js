const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const BASE = process.env.BASE_URL || 'http://localhost:3000'

async function testSignup() {
  const url = `${BASE}/api/auth/signup`
  const payload = {
    email: `test+${Date.now()}@example.com`,
    // include a special character to satisfy server password rules
    password: 'Password123!',
    acceptTerms: true,
    marketingEmails: false,
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const text = await res.text()
    console.log('\n[signup] status:', res.status)
    console.log('[signup] response:', text)
  }
  catch (err) {
    console.error('\n[signup] error:', err.message)
  }
}

async function testOAuthRedirects() {
  const providers = [
    { name: 'google', path: '/auth/google' },
    { name: 'github', path: '/auth/github' },
    { name: 'oauth-callback', path: '/api/auth/oauth/callback' },
  ]

  for (const p of providers) {
    const url = `${BASE}${p.path}`
    try {
      const res = await fetch(url, { method: 'GET', redirect: 'manual' })
      console.log(`\n[oauth:${p.name}] ${url} -> status: ${res.status} location:`, res.headers.get('location'))
    }
    catch (err) {
      console.error(`\n[oauth:${p.name}] error:`, err.message)
    }
  }
}

async function main() {
  console.log('Auth checks starting against', BASE)
  await testSignup()
  await testOAuthRedirects()
  console.log('\nDone')
}

main()
  .catch((err) => { console.error(err); process.exit(1) })
