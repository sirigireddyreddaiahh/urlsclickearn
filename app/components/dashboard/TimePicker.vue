<script setup>
import { now } from '@internationalized/date'
import { useUrlSearchParams } from '@vueuse/core'

const emit = defineEmits(['update:timeRange'])

const timeRange = ref('last-1h')

watch(timeRange, (newValue) => {
  switch (newValue) {
    case 'today':
      emit('update:timeRange', [date2unix(now(), 'start'), date2unix(now())], newValue)
      break
    case 'last-5m':
      emit('update:timeRange', [date2unix(now().subtract({ minutes: 5 })), date2unix(now())], newValue)
      break
    case 'last-10m':
      emit('update:timeRange', [date2unix(now().subtract({ minutes: 10 })), date2unix(now())], newValue)
      break
    case 'last-30m':
      emit('update:timeRange', [date2unix(now().subtract({ minutes: 30 })), date2unix(now())], newValue)
      break
    case 'last-1h':
      emit('update:timeRange', [date2unix(now().subtract({ hours: 1 })), date2unix(now())], newValue)
      break
    case 'last-6h':
      emit('update:timeRange', [date2unix(now().subtract({ hours: 6 })), date2unix(now())], newValue)
      break
    case 'last-12h':
      emit('update:timeRange', [date2unix(now().subtract({ hours: 12 })), date2unix(now())], newValue)
      break
    case 'last-24h':
      emit('update:timeRange', [date2unix(now().subtract({ hours: 24 })), date2unix(now())], newValue)
      break
    default:
      break
  }
}, { deep: true })

function restoreTimeRange() {
  try {
    const searchParams = useUrlSearchParams('history')
    if (searchParams.time) {
      timeRange.value = searchParams.time
      triggerRef(timeRange)
    }
  }
  catch (error) {
    console.error('restore searchParams error', error)
  }
}

defineExpose({
  restoreTimeRange,
})

onBeforeMount(() => {
  restoreTimeRange()
})
</script>

<template>
  <Select v-model="timeRange">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="last-5m">
        Last 5 Minutes
      </SelectItem>
      <SelectItem value="last-10m">
        Last 10 Minutes
      </SelectItem>
      <SelectItem value="last-30m">
        Last 30 Minutes
      </SelectItem>
      <SelectItem value="last-1h">
        Last 1 Hour
      </SelectItem>
      <SelectItem value="last-6h">
        Last 6 Hours
      </SelectItem>
      <SelectItem value="last-12h">
        Last 12 Hours
      </SelectItem>
      <SelectItem value="last-24h">
        Last 24 Hours
      </SelectItem>
      <SelectSeparator />
      <SelectItem value="today">
        Today
      </SelectItem>
    </SelectContent>
  </Select>
</template>
