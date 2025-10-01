<script setup lang="ts">
import * as AutoFormLabelNS from './AutoFormLabel.vue';
const AutoFormLabel = (AutoFormLabelNS as any).default ?? AutoFormLabelNS;
import { beautifyObjectName } from './utils';
import type { FieldProps } from './interface';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormDescription from '@/components/ui/form/FormDescription.vue';
import FormField from '@/components/ui/form/FormField.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import Label from '@/components/ui/label/Label.vue';
import RadioGroup from '@/components/ui/radio-group/RadioGroup.vue';
import RadioGroupItem from '@/components/ui/radio-group/RadioGroupItem.vue';

defineProps<
  FieldProps & {
    options?: string[];
  }
>();
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <RadioGroup v-if="config?.component === 'radio'" :disabled="disabled" :orientation="'vertical'"
            v-bind="{ ...slotProps.componentField }">
            <div v-for="(option, index) in options" :key="option" class="mb-2 flex items-center gap-3 space-y-0">
              <RadioGroupItem :id="`${option}-${index}`" :value="option" />
              <Label :for="`${option}-${index}`">{{ beautifyObjectName(option) }}</Label>
            </div>
          </RadioGroup>

          <Select v-else :disabled="disabled" v-bind="{ ...slotProps.componentField }">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="config?.inputProps?.placeholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in options" :key="option" :value="option">
                {{ beautifyObjectName(option) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </slot>
      </FormControl>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
