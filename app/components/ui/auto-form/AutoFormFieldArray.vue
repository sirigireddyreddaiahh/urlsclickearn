<script setup lang="ts">
import * as z from 'zod';
import { computed, provide, toRefs } from 'vue';
import { PlusIcon, TrashIcon } from 'lucide-vue-next';
import { FieldArray, FieldContextKey, useField } from 'vee-validate';
import type { Config, ConfigItem } from './interface';
import { beautifyObjectName, getBaseType } from './utils';
import * as AutoFormFieldNS from './AutoFormField.vue';
const AutoFormField = (AutoFormFieldNS as any).default ?? AutoFormFieldNS;
import * as AutoFormLabelNS from './AutoFormLabel.vue';
const AutoFormLabel = (AutoFormLabelNS as any).default ?? AutoFormLabelNS;
import Accordion from '@/components/ui/accordion/Accordion.vue';
import AccordionContent from '@/components/ui/accordion/AccordionContent.vue';
import AccordionItem from '@/components/ui/accordion/AccordionItem.vue';
import AccordionTrigger from '@/components/ui/accordion/AccordionTrigger.vue';
import Button from '@/components/ui/button/Button.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';

const props = defineProps<any>();
const { fieldName, required, disabled, schema, config } = toRefs(props);

function isZodArray(item: z.ZodArray<any> | z.ZodDefault<any>): item is z.ZodArray<any> {
  return item instanceof z.ZodArray;
}

function isZodDefault(item: z.ZodArray<any> | z.ZodDefault<any>): item is z.ZodDefault<any> {
  return item instanceof z.ZodDefault;
}

const itemShape = computed(() => {
  if (!props.schema) return;

  const schema: z.ZodAny = isZodArray(props.schema)
    ? props.schema._def.type
    : isZodDefault(props.schema)
      ? props.schema._def.innerType._def.type
      : null;

  return {
    type: getBaseType(schema),
    schema,
  };
});

const safeItemShape = computed(
  () =>
    itemShape.value ??
    ({
      type: 'unknown',
      schema: undefined,
      default: undefined,
      options: undefined,
      required: false,
    } as any)
);

function pushNull(push: (v: any) => void) {
  push(null);
}

const fieldContext = useField(props.fieldName);
// @ts-expect-error ignore missing `id`
provide(FieldContextKey, fieldContext);
</script>

<template>
  <FieldArray v-slot="{ fields, remove, push }" as="section" :name="fieldName">
    <slot v-bind="props">
      <Accordion type="multiple" class="w-full" collapsible :disabled="disabled" as-child>
        <FormItem>
          <AccordionItem :value="fieldName" class="border-none">
            <AccordionTrigger>
              <AutoFormLabel class="text-base" :required="required">
                {{ schema?.description || beautifyObjectName(fieldName) }}
              </AutoFormLabel>
            </AccordionTrigger>

            <AccordionContent>
              <template v-for="(field, index) of fields" :key="field.key">
                <div class="mb-4 p-1">
                  <AutoFormField :field-name="`${fieldName}[${index}]`" :label="fieldName" :shape="safeItemShape"
                    :config="config" />

                  <div class="!my-4 flex justify-end">
                    <Button type="button" size="icon" variant="secondary" @click="remove(index)">
                      <TrashIcon :size="16" />
                    </Button>
                  </div>
                  <Separator v-if="!field.isLast" />
                </div>
              </template>

              <Button type="button" variant="secondary" class="mt-4 flex items-center" @click="() => pushNull(push)">
                <PlusIcon class="mr-2" :size="16" />
                Add
              </Button>
            </AccordionContent>

            <FormMessage />
          </AccordionItem>
        </FormItem>
      </Accordion>
    </slot>
  </FieldArray>
</template>
