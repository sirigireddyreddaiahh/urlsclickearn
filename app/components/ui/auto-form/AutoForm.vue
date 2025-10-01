<script setup lang="ts">
import { computed, toRefs } from 'vue';
import type { ZodAny, z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import type { FormContext, GenericObject } from 'vee-validate';
import {
  type ZodObjectOrWrapped,
  getBaseSchema,
  getBaseType,
  getDefaultValueInZodStack,
  getObjectFormSchema,
} from './utils';
import type { Config, ConfigItem, Dependency, Shape } from './interface';
import * as AutoFormFieldNS from './AutoFormField.vue';
const AutoFormField = (AutoFormFieldNS as any).default ?? AutoFormFieldNS;
import { provideDependencies } from './dependencies';
import Form from '@/components/ui/form/Form.vue';

const props = defineProps<any>();

const emits = defineEmits<{
  submit: [event: GenericObject];
}>();

const { dependencies } = toRefs(props);
provideDependencies(dependencies);

const shapes = computed(() => {
  const val: Record<string, Shape> = {};
  const baseSchema = getObjectFormSchema(props.schema);
  if (!baseSchema) return val;
  const shape = baseSchema.shape || {};
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
      schema: baseItem,
    };
  });
  return val;
});

const fields = computed(() => {
  const val: Record<string, { shape: Shape; fieldName: string; config?: ConfigItem }> = {};
  for (const key in shapes.value) {
    const shape = shapes.value[key];
    val[key] = {
      shape,
      config: props.fieldConfig?.[key],
      fieldName: key,
    };
  }
  return val;
});

const formComponent = computed(() => (props.form ? 'form' : Form));
const formComponentProps = computed(() => {
  if (props.form) {
    return {
      onSubmit: props.form.handleSubmit((val: any) => emits('submit', val)),
    };
  } else {
    const formSchema = toTypedSchema(props.schema);
    return {
      keepValues: true,
      validationSchema: formSchema,
      onSubmit: (val: GenericObject) => emits('submit', val),
    };
  }
});
</script>

<template>
  <component :is="formComponent" v-bind="formComponentProps">
    <slot name="customAutoForm" :fields="fields">
      <template v-for="(shape, key) of shapes" :key="key">
        <slot :shape="shape" :name="key.toString()" :field-name="key.toString()" :config="props.fieldConfig?.[key]">
          <AutoFormField :config="props.fieldConfig?.[key]" :field-name="key.toString()" :shape="shape" />
        </slot>
      </template>
    </slot>

    <slot :shapes="shapes" />
  </component>
</template>
