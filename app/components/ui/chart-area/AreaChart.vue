<script setup lang="ts">
// Import entire libraries as namespaces and create safe fallbacks for runtime usage.
import * as UnovisTs from '@unovis/ts';
import * as UnovisVue from '@unovis/vue';
import { type Component, computed, ref } from 'vue';
import { useMounted } from '@vueuse/core';
import ChartCrosshair from '@/components/ui/chart/ChartCrosshair.vue';
import ChartLegend from '@/components/ui/chart/ChartLegend.vue';
import { defaultColors } from '@/components/ui/chart/interface';
import { cn } from '@/utils';

const props = withDefaults(
  defineProps<
    any & {
      /**
       * Render custom tooltip component.
       */
      customTooltip?: Component;
      /**
       * Type of curve
       */
      curveType?: any;
      /**
       * Controls the visibility of gradient.
       * @default true
       */
      showGradiant?: boolean;
    }
  >(),
  {
    curveType: (UnovisTs as any)?.CurveType?.MonotoneX ?? 'monotoneX',
    filterOpacity: 0.2,
    margin: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    showXAxis: true,
    showYAxis: true,
    showTooltip: true,
    showLegend: true,
    showGridLine: true,
    showGradiant: true,
  }
);

const emits = defineEmits<{
  legendItemClick: [d: any, i: number];
}>();

const index = computed(() => (props as any).index);
const colors = computed(() =>
  (props as any).colors?.length
    ? (props as any).colors
    : defaultColors(((props as any).categories || []).length)
);

const showLegend = computed(() => (props as any).showLegend);
const data = computed(() => (props as any).data);
const categories = computed(() => (props as any).categories || []);
const showGradiant = computed(() => (props as any).showGradiant);
const filterOpacity = computed(() => (props as any).filterOpacity);
const customTooltip = computed(() => (props as any).customTooltip);
const showTooltip = computed(() => (props as any).showTooltip);
const showXAxis = computed(() => (props as any).showXAxis);
const showYAxis = computed(() => (props as any).showYAxis);
const showGridLine = computed(() => (props as any).showGridLine);

const legendItems = ref<any[]>(
  categories.value.map((category: any, i: number) => ({
    name: category,
    color: colors.value[i],
    inactive: false,
  }))
);

// runtime-safe bindings for unovis vue components (may be undefined depending on installed package)
const VisArea = (UnovisVue as any).VisArea ?? ({} as any);
const VisLine = (UnovisVue as any).VisLine ?? ({} as any);
const VisAxis = (UnovisVue as any).VisAxis ?? ({} as any);
const VisXYContainer = (UnovisVue as any).VisXYContainer ?? ({} as any);

const curveType = computed(() => (props as any).curveType);

function areaAttributes(i: number) {
  const selectors = (UnovisTs as any).Area?.selectors || { area: 'area' };
  const selector = selectors.area ?? 'area';
  return { [selector]: { fill: `url(#color-${i})` } };
}

function lineAttributes(i: number) {
  const selectors = (UnovisTs as any).Line?.selectors || { line: 'line' };
  const selector = selectors.line ?? 'line';
  return {
    [selector]: { opacity: legendItemsFindInactive(categories.value[i]) ? filterOpacity.value : 1 },
  };
}

function axisAttributes() {
  const selectors = (UnovisTs as any).Axis?.selectors || { grid: 'grid' };
  const selector = selectors.grid ?? 'grid';
  return { [selector]: { class: 'text-muted' } };
}

// helpers that return pre-built attribute objects for use in templates
function areaAttrFor(i: number) {
  return areaAttributes(i);
}

function lineAttrFor(i: number) {
  return lineAttributes(i);
}

function axisAttr() {
  return axisAttributes();
}

function yFormatter(v: any) {
  const pf = (props as any).yFormatter;
  return pf ? pf(v) : v;
}

const isMounted = useMounted();

function handleLegendItemClick(d: any, i: number) {
  emits('legendItemClick', d, i);
}

// helpers for template to avoid inline typed arrow functions
function xAccessor(d: any, i: number) {
  return i;
}
function yAccessor(category: string) {
  return (d: any) => d[category];
}
function legendItemsFindInactive(category: string) {
  return !!legendItems.value.find((item: any) => item.name === category)?.inactive;
}
function xTickFormatter(v: number) {
  const pf = (props as any).xFormatter;
  const d = (props as any).data;
  const idx = (index as any).value;
  return pf ? pf(v) : d?.[v]?.[idx];
}
</script>

<template>
  <div :class="cn('w-full h-[400px] flex flex-col items-end', $attrs.class ?? '')">
    <ChartLegend v-if="showLegend" v-model:items="legendItems" @legend-item-click="handleLegendItemClick" />

    <VisXYContainer :style="{ height: isMounted ? '100%' : 'auto' }" :margin="{ left: 20, right: 20 }" :data="data">
      <svg width="0" height="0">
        <defs>
          <linearGradient v-for="(color, i) in colors" :id="`color-${i}`" :key="i" x1="0" y1="0" x2="0" y2="1">
            <template v-if="showGradiant">
              <stop offset="5%" :stop-color="color" stop-opacity="0.4" />
              <stop offset="95%" :stop-color="color" stop-opacity="0" />
            </template>
            <template v-else>
              <stop offset="0%" :stop-color="color" />
            </template>
          </linearGradient>
        </defs>
      </svg>

      <ChartCrosshair v-if="showTooltip" :colors="colors" :items="legendItems" :index="index"
        :custom-tooltip="customTooltip" />

      <template v-for="(category, i) in categories" :key="category">
        <VisArea :x="xAccessor" :y="yAccessor(category)" color="auto" :curve-type="curveType"
          :attributes="areaAttrFor(i)" :opacity="legendItemsFindInactive(category) ? filterOpacity : 1" />
      </template>

      <template v-for="(category, i) in categories" :key="category">
        <VisLine :x="xAccessor" :y="yAccessor(category)" :color="colors[i]" :curve-type="curveType"
          :attributes="lineAttrFor(i)" />
      </template>

      <VisAxis v-if="showXAxis" type="x" :tick-format="xTickFormatter" :grid-line="false" :tick-line="false"
        tick-text-color="hsl(var(--vis-text-color))" />
      <VisAxis v-if="showYAxis" type="y" :tick-line="false" :tick-format="yFormatter" :domain-line="false"
        :grid-line="showGridLine" :attributes="axisAttr()" tick-text-color="hsl(var(--vis-text-color))" />

      <slot />
    </VisXYContainer>
  </div>
</template>
