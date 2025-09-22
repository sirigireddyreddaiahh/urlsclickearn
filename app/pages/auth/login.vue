<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
    <div class="p-8 bg-white rounded-xl shadow-2xl w-full max-w-md">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#F72B7E] rounded-full mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p class="text-gray-600 mt-2">
          Sign in to your account
        </p>
      </div>

      <form class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <div class="relative">
            <input
              id="email"
              type="email"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300 pl-10"
              placeholder="Enter your email"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <div class="relative">
            <input
              id="password"
              type="password"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-300 pl-10"
              placeholder="Enter your password"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]">
            <span class="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="/reset-password" class="text-sm font-medium text-[#FF6B35] hover:text-[#F72B7E] transition-colors">Forgot password?</a>
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-[#FF6B35] to-[#F72B7E] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 hover:opacity-90"
        >
          Sign In
        </button>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <a href="/api/auth/oauth/google" class="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span class="ml-2 text-sm font-medium text-gray-700">Continue with Google</span>
          </a>
        </div>
      </form>

      <p class="text-center text-sm text-gray-600 mt-8">
        Don't have an account?
        <a href="/signup" class="font-medium text-[#FF6B35] hover:text-[#F72B7E] transition-colors">Sign up now</a>
      </p>
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
