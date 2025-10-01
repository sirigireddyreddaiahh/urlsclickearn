<script setup lang="ts">
import { ref } from 'vue';
import { TrashIcon } from 'lucide-vue-next';
import * as AutoFormLabelNS from './AutoFormLabel.vue';
const AutoFormLabel = (AutoFormLabelNS as any).default ?? AutoFormLabelNS;
import { beautifyObjectName } from './utils';
import type { FieldProps } from './interface';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormDescription from '@/components/ui/form/FormDescription.vue';
import FormField from '@/components/ui/form/FormField.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';

defineProps<FieldProps>();

const inputFile = ref<File | undefined>();
async function parseFileAsString(file: File | undefined): Promise<string | undefined> {
  if (!file) return undefined;
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

async function handleFileChange(ev: any, slotProps: any) {
  const file = (ev.target as HTMLInputElement).files?.[0];
  inputFile.value = file;
  const parsed = await parseFileAsString(file);
  slotProps.componentField.onInput(parsed);
}

function handleRemoveFile(slotProps: any) {
  inputFile.value = undefined;
  slotProps.componentField.onInput(undefined);
}

// template-friendly wrappers
function _onFileChange(ev: any, slotProps: any) {
  return handleFileChange(ev, slotProps);
}
function _onRemoveFile(slotProps: any) {
  return handleRemoveFile(slotProps);
}
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem v-bind="$attrs">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <Input v-if="!inputFile" type="file" v-bind="{ ...config?.inputProps }" :disabled="disabled"
            @change="_onFileChange($event, slotProps)" />
          <div v-else
            class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent pl-3 pr-1 py-1 text-sm shadow-sm transition-colors">
            <p>{{ inputFile?.name }}</p>
            <Button :size="'icon'" :variant="'ghost'" class="h-[26px] w-[26px]" aria-label="Remove file" type="button"
              @click="_onRemoveFile(slotProps)">
              <TrashIcon :size="16" />
            </Button>
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
