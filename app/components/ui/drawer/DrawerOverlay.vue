<script lang="ts" setup>
import type { DialogOverlayProps } from 'radix-vue';
import type { HtmlHTMLAttributes } from 'vue';
import { cn } from '@/utils';
import { computed } from 'vue';

const props = defineProps<DialogOverlayProps & { class?: HtmlHTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const name = 'UniqueDrawerOverlay';
</script>

<template>
  <div v-bind="delegatedProps" :class="cn('fixed inset-0 z-50 bg-black/80', props.class)" />
</template>
