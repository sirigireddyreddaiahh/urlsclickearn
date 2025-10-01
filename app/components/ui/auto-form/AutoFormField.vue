<script setup lang="ts">
import type { ZodAny } from 'zod';
import { computed } from 'vue';
import type { Config, ConfigItem, Shape } from './interface';
import { DEFAULT_ZOD_HANDLERS, INPUT_COMPONENTS } from './constant';
import useDependencies from './dependencies';

const props = defineProps<{
  fieldName: string;
  shape: Shape;
  config?: ConfigItem | Config<ZodAny>;
}>();

function isValidConfig(config: any): config is ConfigItem {
  return !!config?.component;
}

const delegatedProps = computed(() => {
  if (['ZodObject', 'ZodArray'].includes(props.shape?.type)) return { schema: props.shape?.schema };
  return undefined;
});

const componentToRender = computed(() => {
  // prefer explicit config.component
  if (isValidConfig(props.config)) {
    if (typeof props.config.component === 'string') {
      return INPUT_COMPONENTS[props.config.component] || null;
    }
    return props.config.component;
  }

  const handler = DEFAULT_ZOD_HANDLERS[props.shape?.type];
  return handler ? INPUT_COMPONENTS[handler] : null;
});

const { isDisabled, isHidden, isRequired, overrideOptions } = useDependencies(props.fieldName);
</script>

<template>
  <component
    :is="componentToRender"
    v-if="componentToRender && !isHidden"
    :field-name="fieldName"
    :label="shape.schema?.description"
    :required="isRequired || shape.required"
    :options="overrideOptions || shape.options"
    :disabled="isDisabled"
    :config="config"
    v-bind="delegatedProps"
  >
    <slot />
  </component>
</template>
