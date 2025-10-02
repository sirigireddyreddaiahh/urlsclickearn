<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { validatePassword } from '../../../server/utils/users-file';


const email = ref('');
const password = ref('');
const acceptTerms = ref(false);
const msg = ref('');
const router = useRouter();

const hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password.value));

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
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        acceptTerms: acceptTerms.value,
      }),
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

<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div class="bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] p-6 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-full mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">Create Account</h1>
          <p class="text-white/90 mt-2">Join us to start shortening URLs</p>
        </div>

        <form class="p-8 space-y-6" @submit.prevent="submit" action="#">
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div class="relative">
              <input id="email" v-model="email" type="email" required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300 pl-10"
                placeholder="Enter your email" />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input id="password" v-model="password" type="password" required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300 pl-10"
                placeholder="Create a strong password" />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <!-- Password strength indicators -->
            <div class="mt-3 space-y-2">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full transition-colors"
                  :class="[password.length >= 8 ? 'bg-green-500' : 'bg-gray-300']" />
                <span class="text-sm" :class="[password.length >= 8 ? 'text-green-600 font-medium' : 'text-gray-500']">
                  At least 8 characters
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full transition-colors"
                  :class="[/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300']" />
                <span class="text-sm"
                  :class="[/[A-Z]/.test(password) ? 'text-green-600 font-medium' : 'text-gray-500']">
                  One uppercase letter
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full transition-colors"
                  :class="[/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300']" />
                <span class="text-sm"
                  :class="[/[a-z]/.test(password) ? 'text-green-600 font-medium' : 'text-gray-500']">
                  One lowercase letter
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full transition-colors"
                  :class="[hasSpecialChar ? 'bg-green-500' : 'bg-gray-300']" />
                <span class="text-sm" :class="[hasSpecialChar ? 'text-green-600 font-medium' : 'text-gray-500']">
                  One special character (!@#$...)
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-start">
            <input id="acceptTerms" v-model="acceptTerms" type="checkbox" required
              class="mt-1 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]" />
            <label for="acceptTerms" class="ml-2 text-sm text-gray-600">
              I agree to the
              <a href="/terms" class="text-[#FF6B35] hover:text-[#F72B7E] font-medium">Terms and Conditions</a>
            </label>
          </div>

          <button type="submit"
            class="w-full bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 hover:opacity-90">
            Create Account
          </button>

          <!-- Error/Success Message -->
          <div v-if="msg" class="p-4 rounded-lg text-sm font-medium" :class="[
            msg.includes('successful')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200',
          ]">
            {{ msg }}
          </div>
        </form>

        <div class="px-8 pb-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3">
            <a href="/api/auth/oauth/google" target="_self" rel="noopener noreferrer"
              class="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span class="ml-2 text-sm font-medium text-gray-700">Continue with Google</span>
            </a>
          </div>

          <p class="text-center text-sm text-gray-600 mt-6">
            Already have an account?
            <a href="/auth/login" class="font-medium text-[#FF6B35] hover:text-[#F72B7E] transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional gradient and shadow effects */
input:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

button[type='submit']:hover {
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
}
</style>