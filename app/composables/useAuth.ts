import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Reactive state
const user = ref(null);
const isLoading = ref(false);
const error = ref(null);

// Authentication composable
export function useAuth() {
  const router = useRouter();

  // Computed properties
  const isAuthenticated = computed(() => !!user.value);

  // Clear error
  function clearError() {
    error.value = null;
  }

  // Login method
  async function login(email, password) {
    isLoading.value = true;
    clearError();

    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      user.value = response.user;
      router.push('/dashboard');
    } catch (err) {
      error.value = err.data?.message || 'Login failed. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  // Logout method
  async function logout() {
    isLoading.value = true;
    clearError();

    try {
      await $fetch('/api/auth/logout', { method: 'POST' });
      user.value = null;
      router.push('/auth/login');
    } catch (err) {
      error.value = err.data?.message || 'Logout failed. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  // Register method
  async function register(email, password) {
    isLoading.value = true;
    clearError();

    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password },
      });

      user.value = response.user;
      router.push('/dashboard');
    } catch (err) {
      error.value = err.data?.message || 'Registration failed. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  // Verify email method
  async function verifyEmail(email, code) {
    isLoading.value = true;
    clearError();

    try {
      const response = await $fetch('/api/auth/verify', {
        method: 'POST',
        body: { email, code },
      });

      return { success: true, message: response.message };
    } catch (err) {
      error.value = err.data?.message || 'Verification failed. Please try again.';
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch current user
  async function fetchUser() {
    isLoading.value = true;
    clearError();

    try {
      const response = await $fetch('/api/auth/user');
      user.value = response.user;
    } catch (err) {
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  // Initialize user on load
  fetchUser();

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
  };
}