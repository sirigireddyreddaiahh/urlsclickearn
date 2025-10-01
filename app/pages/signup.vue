<script setup>
import { onMounted } from 'vue';
const router = useRouter();
onMounted(() => router.replace('/auth/signup'));
</script>

<template>
  <div>Redirecting to signup…</div>
</template>
