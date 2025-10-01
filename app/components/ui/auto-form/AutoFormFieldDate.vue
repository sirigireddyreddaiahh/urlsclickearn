<script setup lang="ts">
import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';
import { beautifyObjectName } from './utils';
import * as AutoFormLabelNS from './AutoFormLabel.vue';
const AutoFormLabel = (AutoFormLabelNS as any).default ?? AutoFormLabelNS;
import type { FieldProps } from './interface';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormDescription from '@/components/ui/form/FormDescription.vue';
import FormField from '@/components/ui/form/FormField.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';

import Calendar from '@/components/ui/calendar/Calendar.vue';
import Button from '@/components/ui/button/Button.vue';
import Popover from '@/components/ui/popover/Popover.vue';
import PopoverContent from '@/components/ui/popover/PopoverContent.vue';
import PopoverTrigger from '@/components/ui/popover/PopoverTrigger.vue';
import { cn } from '@/utils';

defineProps<FieldProps>();

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <div>
            <Popover>
              <PopoverTrigger as-child :disabled="disabled">
                <Button variant="outline" :class="cn(
                  'w-full justify-start text-left font-normal',
                  !slotProps.componentField.modelValue && 'text-muted-foreground'
                )
                  ">
                  <CalendarIcon class="mr-2 h-4 w-4" :size="16" />
                  {{
                    slotProps.componentField.modelValue
                      ? df.format(slotProps.componentField.modelValue.toDate(getLocalTimeZone()))
                      : 'Pick a date'
                  }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar initial-focus v-bind="slotProps.componentField" />
              </PopoverContent>
            </Popover>
          </div>
        </slot>
      </FormControl>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
