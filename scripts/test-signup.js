// scripts/test-signup.js
// Usage: node scripts/test-signup.js

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function testSignup() {
  const url = `${BASE}/api/auth/signup`;
  const payload = {
    email: `test+${Date.now()}@example.com`,
    password: 'Password123!',
    acceptTerms: true,
    marketingEmails: false,
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log('\n[signup] status:', res.status);
    console.log('[signup] response:', text);
    if (res.status !== 200 && res.status !== 201) {
      console.error('[signup] FAILED');
      process.exit(1);
    } else {
      console.log('[signup] SUCCESS');
    }
  } catch (err) {
    console.error('\n[signup] error:', err.message);
    process.exit(1);
  }
}

testSignup();
