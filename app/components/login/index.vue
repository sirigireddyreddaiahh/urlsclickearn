<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

async function onSubmit() {
  loading.value = true
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => null)
      throw new Error(j?.statusMessage || j?.message || 'Login failed')
    }
    toast.success('Logged in')
    // after login server sets HttpOnly cookie — navigate to dashboard
    router.push('/dashboard')
  }
  catch (err) {
    toast.error(err.message || 'Login failed')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Login
      </CardTitle>
      <CardDescription>Login with your email and password</CardDescription>
    </CardHeader>

    <CardContent class="grid gap-4">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-input" required>
        </div>
        <div>
          <label class="form-label">Password</label>
          <input v-model="password" type="password" class="form-input" required>
        </div>

        <div class="flex gap-2">
          <Button type="submit" :disabled="loading">
            {{ loading ? 'Logging...' : 'Login' }}
          </Button>
          <NuxtLink to="/auth/reset-request" class="btn-outline">
            Forgot?
          </NuxtLink>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<style scoped>
.form-input{width:100%;padding:10px;border-radius:8px;border:1px solid #e9edf1}
.form-label{display:block;font-weight:600;margin-bottom:6px}
</style>
