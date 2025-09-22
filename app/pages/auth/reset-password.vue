<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const step = ref('email') // email, code, password
const msg = ref('')
const isLoading = ref(false)
const router = useRouter()

async function requestReset() {
  msg.value = ''
  isLoading.value = true
  try {
    const res = await fetch('/api/auth/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.statusMessage || 'Failed to send reset code')
    }

    msg.value = 'Reset code has been sent to your email'
    step.value = 'code'
  }
  catch (err) {
    msg.value = err.message || 'An error occurred while sending reset code'
  }
  finally {
    isLoading.value = false
  }
}

async function verifyCode() {
  if (code.value.length !== 6) {
    msg.value = 'Please enter a valid 6-digit code'
    return
  }
  msg.value = ''
  isLoading.value = true
  step.value = 'password'
  isLoading.value = false
}

async function resetPassword() {
  if (password.value !== confirmPassword.value) {
    msg.value = 'Passwords do not match'
    return
  }

  msg.value = ''
  isLoading.value = true
  try {
    const res = await fetch('/api/auth/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        code: code.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.statusMessage || 'Failed to reset password')
    }

    msg.value = 'Password has been reset successfully! You can now log in with your new password.'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
  catch (err) {
    msg.value = err.message || 'An error occurred while resetting password'
    if (msg.value.includes('Invalid reset code')) {
      step.value = 'code'
    }
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
    <div class="p-8 bg-white rounded-xl shadow-2xl w-full max-w-md">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#F72B7E] rounded-full mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] bg-clip-text text-transparent">
          Reset Password
        </h1>
        <p v-if="step === 'email'" class="text-gray-600 mt-2">
          Enter your email to receive a reset code
        </p>
        <p v-else-if="step === 'code'" class="text-gray-600 mt-2">
          Enter the code sent to your email
        </p>
        <p v-else class="text-gray-600 mt-2">
          Choose a new password
        </p>
      </div>

      <!-- Email Step -->
      <form v-if="step === 'email'" class="space-y-6" @submit.prevent="requestReset">
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <div class="relative">
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300 pl-10"
              placeholder="Enter your email address"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            We'll send you a code to reset your password
          </p>
        </div>

        <button
          type="submit"
          :disabled="isLoading || !email"
          class="w-full bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </span>
          <span v-else>Send Reset Code</span>
        </button>
      </form>

      <!-- Code Step -->
      <form v-else-if="step === 'code'" class="space-y-6" @submit.prevent="verifyCode">
        <div>
          <label for="code" class="block text-sm font-semibold text-gray-700 mb-2">Reset Code</label>
          <div class="relative">
            <input
              id="code"
              v-model="code"
              type="text"
              required
              pattern="[0-9]{6}"
              maxlength="6"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300 pl-10"
              placeholder="Enter 6-digit code"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Enter the 6-digit code sent to {{ email }}
          </p>
        </div>

        <div class="flex space-x-4">
          <button
            type="button"
            class="flex-1 border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:border-gray-300 transform hover:-translate-y-0.5 transition-all duration-300"
            @click="step = 'email'"
          >
            Back
          </button>
          <button
            type="submit"
            :disabled="isLoading || code.length !== 6"
            class="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </span>
            <span v-else>Verify Code</span>
          </button>
        </div>
      </form>

      <!-- Password Step -->
      <form v-else class="space-y-6" @submit.prevent="resetPassword">
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300 pl-10"
              placeholder="Enter new password"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300 pl-10"
              placeholder="Confirm new password"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <div class="flex space-x-4">
          <button
            type="button"
            class="flex-1 border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:border-gray-300 transform hover:-translate-y-0.5 transition-all duration-300"
            @click="step = 'code'"
          >
            Back
          </button>
          <button
            type="submit"
            :disabled="isLoading || !password || !confirmPassword || password !== confirmPassword"
            class="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Resetting...
            </span>
            <span v-else>Reset Password</span>
          </button>
        </div>
      </form>

      <div v-if="msg" class="mt-4 p-4 rounded-lg text-sm font-medium" :class="[msg.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200']">
        {{ msg }}
      </div>

      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600">
          Remember your password?
          <a href="/login" class="font-medium text-[#FF6B35] hover:text-[#F72B7E] transition-colors">Sign in</a>
        </p>
        <p class="text-sm text-gray-600 mt-2">
          Need an account?
          <a href="/signup" class="font-medium text-[#FF6B35] hover:text-[#F72B7E] transition-colors">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles for gradient effects */
input:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

button[type="submit"]:hover {
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
}
</style>
