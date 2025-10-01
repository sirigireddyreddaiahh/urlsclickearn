<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

// Page metadata
definePageMeta({
  layout: 'auth',
  title: 'Verify Email',
});

// Reactive state
const route = useRoute();
const { verifyEmail, isLoading, error, clearError } = useAuth();

const email = ref(route.query.email || '');
const code = ref('');
const success = ref('');
const isResending = ref(false);
const resendCooldown = ref(0);

let cooldownInterval = null;

// Computed properties
const isFormValid = computed(
  () => email.value && code.value.length === 6 && /^\d{6}$/.test(code.value)
);

// Input handler
function onCodeInput(event) {
  const value = event.target.value.replace(/\D/g, '').slice(0, 6);
  code.value = value;
  event.target.value = value;
}

// Form submission
async function handleVerify() {
  clearError();
  const result = await verifyEmail(email.value, code.value);

  if (result.success) {
    success.value = result.message;
    setTimeout(() => navigateTo('/auth/login'), 2000);
  }
}

// Resend code
async function resendCode() {
  if (resendCooldown.value > 0) return;

  isResending.value = true;
  try {
    const response = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: { email: email.value, resend: true },
    });

    success.value = 'Verification code resent!';
    startResendCooldown();
  } catch (err) {
    error.value = err.data?.message || 'Failed to resend code';
  } finally {
    isResending.value = false;
  }
}

// Cooldown logic
function startResendCooldown() {
  resendCooldown.value = 60;
  cooldownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval);
    }
  }, 1000);
}

// Lifecycle hooks
onMounted(() => {
  if (!email.value) {
    navigateTo('/auth/signup');
  }
});

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div
          class="mx-auto w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#F72B7E] rounded-full flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mt-4">Verify Your Email</h1>
        <p class="mt-2 text-sm text-gray-600">
          We sent a 6-digit code to <strong>{{ email }}</strong>
        </p>
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <form class="space-y-6" @submit.prevent="handleVerify">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300"
            />
          </div>

          <div>
            <label for="code" class="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="code"
              v-model="code"
              type="text"
              maxlength="6"
              placeholder="000000"
              required
              class="mt-1 block w-full px-3 py-2 border-2 border-gray-200 rounded-lg shadow-sm text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300"
              @input="onCodeInput"
            />
            <p class="mt-1 text-sm text-gray-500">Enter the 6-digit code from your email</p>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div
            v-if="success"
            class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
          >
            {{ success }}
          </div>

          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B35] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying...
            </span>
            <span v-else>Verify Email</span>
          </button>
        </form>

        <div class="mt-6 text-center space-y-2">
          <p class="text-sm text-gray-600">Didn't receive the code?</p>
          <button
            :disabled="isResending || resendCooldown > 0"
            class="text-[#FF6B35] hover:text-[#F72B7E] font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            @click="resendCode"
          >
            <span v-if="isResending">Sending...</span>
            <span v-else-if="resendCooldown > 0">Resend in {{ resendCooldown }}s</span>
            <span v-else>Resend Code</span>
          </button>
        </div>

        <div class="mt-2 text-sm text-gray-600">
          Verification codes expire after 1 hour. If your code has expired, you can request a new
          one below.
        </div>

        <div class="mt-4">
          <button
            :disabled="isResending"
            class="w-full bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] text-white py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-300"
            @click="resendCode"
          >
            {{ isResending ? 'Resending...' : 'Resend Code' }}
          </button>
        </div>

        <div class="mt-4 text-center">
          <NuxtLink
            to="/auth/login"
            class="text-sm text-[#FF6B35] hover:text-[#F72B7E] transition-colors duration-300"
          >
            Back to Sign In
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
