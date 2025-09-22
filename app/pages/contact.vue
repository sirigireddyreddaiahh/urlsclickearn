<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: '',
})
const submitted = ref(false)

function submitForm() {
  // In production, send to backend or email service
  submitted.value = true
  setTimeout(() => {
    submitted.value = false
    form.value = { name: '', email: '', message: '' }
  }, 3000)
}
</script>

<template>
  <div class="container mx-auto max-w-2xl py-12 px-4">
    <h1 class="text-3xl font-bold mb-6 text-center">
      Contact Us
    </h1>
    <p class="mb-8 text-center text-gray-600 dark:text-gray-300">
      Have a question, feedback, or need help? Reach out to us using the form below or email us directly.
    </p>
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">
        My Email Addresses
      </h2>
      <ul class="mb-4">
        <li class="flex items-center mb-1">
          <span class="font-mono text-blue-600 dark:text-blue-400">admin.rs@urlsclickearn.xyz</span>
          <span class="ml-2 text-xs text-gray-400">22 days ago</span>
        </li>
        <li class="flex items-center mb-1">
          <span class="font-mono text-blue-600 dark:text-blue-400">support@urlsclickearn.xyz</span>
          <span class="ml-2 text-xs text-gray-400">22 days ago</span>
        </li>
        <li class="flex items-center mb-1">
          <span class="font-mono text-blue-600 dark:text-blue-400">info@urlsclickearn.xyz</span>
          <span class="ml-2 text-xs text-gray-400">22 days ago</span>
        </li>
      </ul>
      <div class="flex space-x-2">
        <a href="mailto:admin.rs@urlsclickearn.xyz" class="btn btn-primary">Contact Admin</a>
        <a href="mailto:support@urlsclickearn.xyz" class="btn btn-secondary">Contact Support</a>
        <a href="mailto:info@urlsclickearn.xyz" class="btn btn-accent">Contact Info</a>
      </div>
    </div>
    <form class="bg-white dark:bg-slate-800 shadow rounded-lg p-6" @submit.prevent="submitForm">
      <div class="mb-4">
        <label class="block mb-1 font-medium" for="name">Name</label>
        <input id="name" v-model="form.name" type="text" class="input input-bordered w-full" required>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium" for="email">Email</label>
        <input id="email" v-model="form.email" type="email" class="input input-bordered w-full" required>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium" for="message">Message</label>
        <textarea id="message" v-model="form.message" rows="5" class="input input-bordered w-full" required />
      </div>
      <button type="submit" class="btn btn-primary w-full">
        Send Message
      </button>
      <p v-if="submitted" class="mt-4 text-green-600">
        Thank you! Your message has been sent.
      </p>
    </form>
  </div>
</template>

<style scoped>
.input {
  @apply border border-slate-300 dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.input-bordered {
  @apply shadow-sm;
}
.btn {
  @apply inline-flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-600 text-white hover:bg-gray-700;
}
.btn-accent {
  @apply bg-green-600 text-white hover:bg-green-700;
}
</style>
