<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import * as Radix from 'radix-vue';
import { useFormField } from './useFormField';
import { cn } from '@/utils';
import Label from '@/components/ui/label/Label.vue';

const props = defineProps<Record<string, any> & { class?: HTMLAttributes['class'] }>();

const { error, formItemId } = useFormField();
</script>

<template>
  <Label :class="cn(error && 'text-destructive', props.class)" :for="formItemId">
    <slot />
  </Label>
</template>
