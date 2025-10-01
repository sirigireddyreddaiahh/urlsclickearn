<script setup lang="ts">
import { computed } from 'vue';
import { beautifyObjectName } from './utils';
import type { FieldProps } from './interface';
import * as AutoFormLabelNS from './AutoFormLabel.vue';
const AutoFormLabel = (AutoFormLabelNS as any).default ?? AutoFormLabelNS;
import FormControl from '@/components/ui/form/FormControl.vue';
import FormDescription from '@/components/ui/form/FormDescription.vue';
import FormField from '@/components/ui/form/FormField.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Switch from '@/components/ui/switch/Switch.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';

const props = defineProps<FieldProps>();

const booleanComponent = computed(() => (props.config?.component === 'switch' ? Switch : Checkbox));
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem>
      <div class="space-y-0 mb-3 flex items-center gap-3">
        <FormControl>
          <slot v-bind="slotProps">
            <component :is="booleanComponent" v-bind="{ ...slotProps.componentField }" :disabled="disabled"
              :checked="slotProps.componentField.modelValue"
              @update:checked="slotProps.componentField['onUpdate:modelValue']" />
          </slot>
        </FormControl>
        <AutoFormLabel v-if="!config?.hideLabel" :required="required">
          {{ config?.label || beautifyObjectName(label ?? fieldName) }}
        </AutoFormLabel>
      </div>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
