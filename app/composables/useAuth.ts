import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// Define types for API responses and errors
interface ApiResponse {
  user?: {
    id: string
    email: string
    profile?: UserProfile
    role: 'user' | 'admin' | 'moderator'
    lastLogin?: string
    loginCount: number
  }
  message: string
}

interface ApiError {
  data?: {
    message: string
  }
}

// Reactive state
const user = ref<ApiResponse['user'] | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Authentication composable
export function useAuth() {
  const router = useRouter()

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)

  // Clear error
  function clearError() {
    error.value = null
  }

  // Login method
  async function login(email: string, password: string) {
    isLoading.value = true
    clearError()

    try {
      const response = (await $fetch<ApiResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      }))

      user.value = response.user
      router.push('/dashboard')
    }
    catch (err) {
      const errorData = err as ApiError
      error.value = errorData.data?.message || 'Login failed. Please try again.'
    }
    finally {
      isLoading.value = false
    }
  }

  // Logout method
  async function logout() {
    isLoading.value = true
    clearError()

    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      router.push('/auth/login')
    }
    catch (err) {
      const errorData = err as ApiError
      error.value = errorData.data?.message || 'Logout failed. Please try again.'
    }
    finally {
      isLoading.value = false
    }
  }

  // Register method
  async function register(email: string, password: string) {
    isLoading.value = true
    clearError()

    try {
      const response = (await $fetch<ApiResponse>('/api/auth/signup', {
        method: 'POST',
        body: { email, password },
      }))

      user.value = response.user
      router.push('/dashboard')
    }
    catch (err) {
      const errorData = err as ApiError
      error.value = errorData.data?.message || 'Registration failed. Please try again.'
    }
    finally {
      isLoading.value = false
    }
  }

  // Verify email method
  async function verifyEmail(email: string, code: string) {
    isLoading.value = true
    clearError()

    try {
      const response = (await $fetch<ApiResponse>('/api/auth/verify', {
        method: 'POST',
        body: { email, code },
      }))

      return { success: true, message: response.message }
    }
    catch (err) {
      const errorData = err as ApiError
      error.value = errorData.data?.message || 'Verification failed. Please try again.'
      return { success: false }
    }
    finally {
      isLoading.value = false
    }
  }

  // Fetch current user
  async function fetchUser() {
    isLoading.value = true
    clearError()

    try {
      const response = (await $fetch<ApiResponse>('/api/auth/user'))
      user.value = response.user
    }
    catch {
      user.value = null
    }
    finally {
      isLoading.value = false
    }
  }

  // Initialize user on load
  fetchUser()

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    verifyEmail,
    clearError,
  }
}
