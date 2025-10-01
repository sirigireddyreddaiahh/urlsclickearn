<script setup lang="ts">
import type { ZodAny, ZodObject, ZodRawShape } from 'zod';
import { computed, provide, toRefs } from 'vue';
import { FieldContextKey, useField } from 'vee-validate';
import * as AutoFormFieldNS from './AutoFormField.vue';
const AutoFormField = (AutoFormFieldNS as any).default ?? AutoFormFieldNS;
import type { Config, ConfigItem, Shape } from './interface';
import { beautifyObjectName, getBaseSchema, getBaseType, getDefaultValueInZodStack } from './utils';
import * as AutoFormLabelNS from './AutoFormLabel.vue';
const AutoFormLabel = (AutoFormLabelNS as any).default ?? AutoFormLabelNS;
import Accordion from '@/components/ui/accordion/Accordion.vue';
import AccordionContent from '@/components/ui/accordion/AccordionContent.vue';
import AccordionItem from '@/components/ui/accordion/AccordionItem.vue';
import AccordionTrigger from '@/components/ui/accordion/AccordionTrigger.vue';
import FormItem from '@/components/ui/form/FormItem.vue';

const props = defineProps<any>();
const { fieldName, required, disabled, schema, config } = toRefs(props);

const shapes = computed(() => {
  // @ts-expect-error ignore {} not assignable to object
  const val: { [key in keyof T]: Shape } = {};

  if (!props.schema) return;
  const shape = getBaseSchema(props.schema)?.shape;
  if (!shape) return;
  Object.keys(shape).forEach((name) => {
    const item = shape[name] as ZodAny;
    const baseItem = getBaseSchema(item) as ZodAny;
    let options: string[] | undefined = undefined;
    if (baseItem && baseItem._def && 'values' in (baseItem._def as any))
      options = (baseItem._def as any).values as string[];
    else if (baseItem && typeof (baseItem._def as any)?.values === 'object')
      options = Object.values((baseItem._def as any).values);

    val[name] = {
      type: getBaseType(item),
      default: getDefaultValueInZodStack(item),
      options,
      required: !['ZodOptional', 'ZodNullable'].includes(item._def?.typeName),
      schema: item,
    };
  });
  return val;
});

const fieldContext = useField(props.fieldName);
// @ts-expect-error ignore missing `id`
provide(FieldContextKey, fieldContext);
</script>

<template>
  <section>
    <slot v-bind="props">
      <Accordion type="single" as-child class="w-full" collapsible :disabled="disabled">
        <FormItem>
          <AccordionItem :value="fieldName" class="border-none">
            <AccordionTrigger>
              <AutoFormLabel class="text-base" :required="required">
                {{ schema?.description || beautifyObjectName(fieldName) }}
              </AutoFormLabel>
            </AccordionTrigger>
            <AccordionContent class="p-1 space-y-5">
              <template v-for="(shape, key) in shapes" :key="key">
                <AutoFormField :config="config?.[key]" :field-name="`${fieldName}.${key.toString()}`"
                  :label="key.toString()" :shape="shape" />
              </template>
            </AccordionContent>
          </AccordionItem>
        </FormItem>
      </Accordion>
    </slot>
  </section>
</template>
