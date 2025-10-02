<script lang="ts" setup>
// import type { DrawerDescriptionProps } from 'vaul-vue'
// import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '@/utils'
import { DrawerDescription } from 'vaul-vue'
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
  <DrawerDescription v-bind="delegatedProps" :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </DrawerDescription>
</template>
