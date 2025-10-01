<script setup>
import { onMounted } from 'vue';
const router = useRouter();
onMounted(() => router.replace('/auth/reset-password'));
</script>
<template><div>Redirecting to reset password…</div></template>
