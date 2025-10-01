<script lang="ts" setup>
import { DrawerRoot } from 'vaul-vue';

const props = defineProps<{ shouldScaleBackground?: boolean }>();
</script>
nd?: boolean }>(), {
<template>
  <DrawerRoot :shouldScaleBackground="props.shouldScaleBackground">
    <slot />
  </DrawerRoot>
</template>
