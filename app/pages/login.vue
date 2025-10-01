<script setup>
import { onMounted } from 'vue';
const router = useRouter();
onMounted(() => router.replace('/auth/login'));
</script>
<template><div>Redirecting to login…</div></template>
