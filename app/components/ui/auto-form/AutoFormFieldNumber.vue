<script setup lang="ts">
import AutoFormLabel from './AutoFormLabel.vue';
import { beautifyObjectName } from './utils';
import type { FieldProps } from './interface';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormDescription from '@/components/ui/form/FormDescription.vue';
import FormField from '@/components/ui/form/FormField.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Input from '@/components/ui/input/Input.vue';

defineOptions({
  inheritAttrs: false,
});

defineProps<FieldProps>();
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <Input type="number" v-bind="{ ...slotProps.componentField, ...config?.inputProps }" :disabled="disabled" />
        </slot>
      </FormControl>
      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
