<template>
  <div class="auth-page">
    <h1>Sign up</h1>
    <form @submit.prevent="submit">
      <label>Email<input v-model="email" type="email" required /></label>
      <label>Password<input v-model="password" type="password" required /></label>

      <div class="password-hints">
        <div :class="{ok: password.length>=8}">At least 8 characters</div>
        <div :class="{ok: /[A-Z]/.test(password)}">Uppercase</div>
        <div :class="{ok: /[a-z]/.test(password)}">Lowercase</div>
        <div :class="{ok: /[0-9]/.test(password)}">Number</div>
      </div>

      <button type="submit">Sign up</button>
    </form>
    <div v-if="msg" class="info">{{ msg }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { validatePassword } from '@/server/utils/users-file';

const email = ref('')
const password = ref('')
const msg = ref('')
const router = useRouter()

async function submit() {
  msg.value = '';

  // Validate password using centralized logic
  const { valid, errors } = await validatePassword(password.value);
  if (!valid) {
    msg.value = errors.join(', ');
    return;
  }

  try {
    // Proceed with signup logic
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    if (!res.ok) {
      const j = await res.json().catch(() => null);
      throw new Error(j?.statusMessage || j?.message || 'Signup failed');
    }

    msg.value = 'Signup successful! Please check your email to verify your account.';
    router.push({ path: '/auth/verify', query: { email: email.value } });
  } catch (e) {
    msg.value = e.message || 'Error';
  }
}
</script>

<style scoped>
.auth-page{max-width:480px;margin:32px auto;padding:18px}
.password-hints div{font-size:13px}
.ok{color:green}
</style>
