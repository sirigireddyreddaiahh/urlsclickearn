<script lang="ts" setup>
import { type HTMLAttributes, computed } from 'vue';
import * as Radix from 'radix-vue';
import { useForwardProps } from 'radix-vue';
import { cn } from '@/utils';

const props = defineProps<Record<string, any> & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);

const RadixCalendarHeading = (Radix as any).CalendarHeading ?? undefined;
</script>

<template>
  <component
    :is="RadixCalendarHeading ?? 'div'"
    v-slot="{ headingValue }"
    :class="cn('text-sm font-medium', props.class)"
    v-bind="forwardedProps"
  >
    <slot :heading-value="headingValue">
      {{ headingValue }}
    </slot>
  </component>
</template>
