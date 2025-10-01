<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const router = useRouter();

async function onSubmit() {
  // lightweight placeholder — server endpoint exists at /api/auth/request-reset
  try {
    await fetch('/api/auth/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    });
    // navigate to reset-password which expects a code flow
    router.push('/auth/reset-password');
  } catch (err) {
    // ignore — this is a minimal placeholder
  }
}
</script>

<template>
  <Card class="max-w-md mx-auto">
    <CardHeader>
      <CardTitle>Reset password</CardTitle>
      <CardDescription>Enter your account email to receive a reset code</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-input" required />
        </div>
        <Button type="submit">Send reset code</Button>
      </form>
    </CardContent>
  </Card>
</template>
