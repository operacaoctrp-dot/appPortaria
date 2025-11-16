<template>
  <div
    class="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 hover:shadow-md transition-all duration-200"
  >
    <!-- Header do Card -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="p-3 rounded-lg" :class="iconBgClass">
          <component :is="icon" class="h-6 w-6" :class="iconClass" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-neutral-600">{{ title }}</h3>
          <p class="text-2xl font-bold" :class="valueClass">
            {{ formattedValue }}
          </p>
        </div>
      </div>

      <!-- Botão de ação opcional -->
      <button
        v-if="hasAction"
        @click="$emit('action')"
        class="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <EllipsisHorizontalIcon class="h-5 w-5" />
      </button>
    </div>

    <!-- Trend/Change indicator -->
    <div v-if="trend" class="flex items-center">
      <component :is="trendIcon" class="h-4 w-4 mr-1" :class="trendClass" />
      <span class="text-sm font-medium" :class="trendClass">
        {{ Math.abs(trend.percentage) }}%
      </span>
      <span class="text-sm text-neutral-500 ml-1">
        {{ trend.period }}
      </span>
    </div>

    <!-- Descrição adicional -->
    <p v-if="description" class="text-sm text-neutral-500 mt-2">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  EllipsisHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
} from "@heroicons/vue/24/outline";

interface Trend {
  percentage: number;
  direction: "up" | "down" | "neutral";
  period: string;
}

interface Props {
  title: string;
  value: number | string;
  icon: any;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  trend?: Trend;
  description?: string;
  hasAction?: boolean;
  formatAs?: "number" | "currency" | "percentage" | "text";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "neutral",
  hasAction: false,
  formatAs: "text",
});

defineEmits<{
  action: [];
}>();

const iconBgClass = computed(() => {
  const variants = {
    primary: "bg-primary-100",
    success: "bg-success-100",
    warning: "bg-warning-100",
    danger: "bg-danger-100",
    neutral: "bg-neutral-100",
  };
  return variants[props.variant];
});

const iconClass = computed(() => {
  const variants = {
    primary: "text-primary-600",
    success: "text-success-600",
    warning: "text-warning-600",
    danger: "text-danger-600",
    neutral: "text-neutral-600",
  };
  return variants[props.variant];
});

const valueClass = computed(() => {
  const variants = {
    primary: "text-primary-700",
    success: "text-success-700",
    warning: "text-warning-700",
    danger: "text-danger-700",
    neutral: "text-neutral-800",
  };
  return variants[props.variant];
});

const formattedValue = computed(() => {
  if (typeof props.value === "string") return props.value;

  switch (props.formatAs) {
    case "number":
      return new Intl.NumberFormat("pt-BR").format(props.value);
    case "currency":
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(props.value);
    case "percentage":
      return `${props.value}%`;
    default:
      return props.value.toString();
  }
});

const trendIcon = computed(() => {
  if (!props.trend) return null;

  switch (props.trend.direction) {
    case "up":
      return ArrowUpIcon;
    case "down":
      return ArrowDownIcon;
    default:
      return MinusIcon;
  }
});

const trendClass = computed(() => {
  if (!props.trend) return "";

  switch (props.trend.direction) {
    case "up":
      return "text-success-600";
    case "down":
      return "text-danger-600";
    default:
      return "text-neutral-500";
  }
});
</script>
