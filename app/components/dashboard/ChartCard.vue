<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-neutral-800">{{ title }}</h3>

      <!-- Filtros -->
      <div class="flex items-center space-x-2">
        <select
          v-model="selectedPeriod"
          @change="updateChart"
          class="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="today">Hoje</option>
          <option value="week">Esta Semana</option>
          <option value="month">Este Mês</option>
        </select>

        <button
          @click="refreshData"
          :disabled="loading"
          class="p-1.5 text-neutral-500 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative" style="height: 300px">
      <canvas ref="chartRef"></canvas>

      <!-- Loading Overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"
        ></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!hasData"
        class="absolute inset-0 flex flex-col items-center justify-center text-neutral-500"
      >
        <ChartBarIcon class="h-12 w-12 mb-2 text-neutral-300" />
        <p class="text-sm font-medium">Nenhum dado disponível</p>
        <p class="text-xs">Selecione um período diferente</p>
      </div>
    </div>

    <!-- Legend -->
    <div
      v-if="hasData && showLegend"
      class="flex justify-center mt-4 space-x-4"
    >
      <div
        v-for="item in legendItems"
        :key="item.label"
        class="flex items-center"
      >
        <div
          class="w-3 h-3 rounded-sm mr-2"
          :style="{ backgroundColor: item.color }"
        ></div>
        <span class="text-sm text-neutral-600">{{ item.label }}</span>
      </div>
    </div>

    <!-- Summary Stats -->
    <div
      v-if="hasData && summaryStats"
      class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-100"
    >
      <div v-for="stat in summaryStats" :key="stat.label" class="text-center">
        <p class="text-xl font-bold text-neutral-800">{{ stat.value }}</p>
        <p class="text-xs text-neutral-500">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  nextTick,
} from "vue";
import { ArrowPathIcon, ChartBarIcon } from "@heroicons/vue/24/outline";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Registrar componentes do Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

interface SummaryStat {
  label: string;
  value: string | number;
}

interface LegendItem {
  label: string;
  color: string;
}

interface Props {
  title: string;
  type?: "line" | "bar" | "doughnut" | "pie";
  data: ChartData;
  loading?: boolean;
  showLegend?: boolean;
  summaryStats?: SummaryStat[];
}

const props = withDefaults(defineProps<Props>(), {
  type: "line",
  loading: false,
  showLegend: true,
});

const emit = defineEmits<{
  refresh: [period: string];
  periodChange: [period: string];
}>();

const chartRef = ref<HTMLCanvasElement>();
const chart = ref<Chart | null>(null);
const selectedPeriod = ref("today");

const hasData = computed(() => {
  return (
    props.data?.datasets?.some((dataset) =>
      dataset.data?.some((value) => value > 0)
    ) || false
  );
});

const legendItems = computed((): LegendItem[] => {
  if (!props.data?.datasets) return [];

  return props.data.datasets.map((dataset) => ({
    label: dataset.label,
    color:
      (Array.isArray(dataset.backgroundColor)
        ? dataset.backgroundColor[0]
        : dataset.backgroundColor) || "#3B82F6",
  }));
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Usamos nossa própria legenda
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales:
    props.type === "doughnut" || props.type === "pie"
      ? {}
      : {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#6B7280",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(107, 114, 128, 0.1)",
            },
            ticks: {
              color: "#6B7280",
            },
          },
        },
  animation: {
    duration: 750,
    easing: "easeInOutQuart" as const,
  },
}));

const createChart = () => {
  if (!chartRef.value) return;

  destroyChart();

  chart.value = new Chart(chartRef.value, {
    type: props.type,
    data: props.data,
    options: chartOptions.value,
  });
};

const updateChart = () => {
  if (chart.value) {
    chart.value.data = props.data;
    chart.value.options = chartOptions.value;
    chart.value.update("active");
  } else {
    nextTick(() => createChart());
  }
};

const destroyChart = () => {
  if (chart.value) {
    chart.value.destroy();
    chart.value = null;
  }
};

const refreshData = () => {
  emit("refresh", selectedPeriod.value);
};

// Watch para mudanças nos dados
watch(
  () => props.data,
  () => {
    if (hasData.value) {
      updateChart();
    }
  },
  { deep: true }
);

// Watch para mudanças no tipo
watch(
  () => props.type,
  () => {
    createChart();
  }
);

// Watch para mudanças no período
watch(selectedPeriod, (newPeriod) => {
  emit("periodChange", newPeriod);
});

onMounted(() => {
  nextTick(() => {
    if (hasData.value) {
      createChart();
    }
  });
});

onBeforeUnmount(() => {
  destroyChart();
});

// Expor métodos para o componente pai
defineExpose({
  updateChart,
  refreshData,
  chart: computed(() => chart.value),
});
</script>
