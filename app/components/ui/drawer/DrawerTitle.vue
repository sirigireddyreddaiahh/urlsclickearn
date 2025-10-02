<script lang="ts" setup>
// import type { DrawerTitleProps } from 'vaul-vue'
// import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '@/utils'
import { DrawerTitle } from 'vaul-vue'
import { computed } from 'vue'

const props = defineProps()

const delegatedProps = computed(() => {
  // @ts-ignore
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <!-- @ts-ignore -->
  <DrawerTitle v-bind="delegatedProps" :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)">
    <slot />
  </DrawerTitle>
</template>
