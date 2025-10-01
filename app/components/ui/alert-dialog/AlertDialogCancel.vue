<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import * as Radix from 'radix-vue';
import type { AlertDialogCancelProps as _AlertDialogCancelProps } from 'radix-vue';
import { cn } from '@/utils';
import { buttonVariants } from '@/components/ui/button/styles';

// Use the Radix-provided props type when available, otherwise fall back to a permissive type
// Use permissive props type - radix doesn't export the Props aliases in some versions
const props = defineProps<Record<string, any> & { class?: HTMLAttributes['class'] }>();

// runtime-safe reference to the radix component (may be undefined)
const RadixAlertDialogCancel = (Radix as any).AlertDialogCancel ?? undefined;

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <component :is="RadixAlertDialogCancel ?? 'button'" v-bind="delegatedProps"
    :class="cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', props.class)">
    <slot />
  </component>
</template>
