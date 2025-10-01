<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
onMounted(() => {
  // Preferred behavior: client-side redirect to explicit subpage
  router.replace('/dashboard/links');
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-semibold">Redirecting to dashboard…</h1>
    <p class="mt-2 text-sm">
      If you are not redirected automatically,
      <NuxtLink to="/dashboard/links">click here</NuxtLink>.
    </p>
  </div>
</template>
