import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { logger } from "~/utils/logger";

interface ChartDataShape {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

export const useAnalyticsStore = defineStore("analytics", () => {
  const analyticsData = useAnalyticsData();
  const useRealData = ref(true); // Flag para alternar entre dados reais e mock
  const loading = ref(false);

  // Mock datasets for fallback/testing
  const mock = {
    today: {
      labels: ["06h", "08h", "10h", "12h", "14h", "16h", "18h"],
      datasets: [
        {
          label: "Entradas",
          data: [3, 8, 14, 9, 7, 5, 2],
          backgroundColor: "#3B82F6",
          borderColor: "#2563EB",
        },
        {
          label: "Saídas",
          data: [1, 2, 6, 5, 4, 3, 1],
          backgroundColor: "#F97316",
          borderColor: "#EA580C",
        },
      ],
    } as ChartDataShape,
    week: {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      datasets: [
        {
          label: "Entradas",
          data: [45, 52, 60, 58, 70, 30, 24],
          backgroundColor: "#3B82F6",
          borderColor: "#2563EB",
        },
        {
          label: "Saídas",
          data: [32, 28, 35, 30, 40, 18, 20],
          backgroundColor: "#F97316",
          borderColor: "#EA580C",
        },
      ],
    } as ChartDataShape,
    month: {
      labels: Array.from({ length: 12 }).map((_, i) => `Sem ${i + 1}`),
      datasets: [
        {
          label: "Entradas",
          data: Array.from({ length: 12 }).map(() =>
            Math.round(50 + Math.random() * 80)
          ),
          backgroundColor: "#3B82F6",
          borderColor: "#2563EB",
        },
        {
          label: "Saídas",
          data: Array.from({ length: 12 }).map(() =>
            Math.round(20 + Math.random() * 50)
          ),
          backgroundColor: "#F97316",
          borderColor: "#EA580C",
        },
      ],
    } as ChartDataShape,
  };

  const current = ref<ChartDataShape>(mock.today);
  const currentPeriod = ref<"today" | "week" | "month">("today");

  async function loadRealData(period: "today" | "week" | "month" = "today") {
    loading.value = true;

    try {
      if (period === "today") {
        const hourlyData = await analyticsData.getHourlyStats();

        current.value = {
          labels: hourlyData.map((h) => h.hour),
          datasets: [
            {
              label: "Entradas",
              data: hourlyData.map((h) => h.entradas),
              backgroundColor: "#3B82F6",
              borderColor: "#2563EB",
            },
            {
              label: "Saídas",
              data: hourlyData.map((h) => h.saidas),
              backgroundColor: "#F97316",
              borderColor: "#EA580C",
            },
          ],
        };
      } else if (period === "week") {
        const weekData = await analyticsData.getWeeklyStats();

        current.value = {
          labels: weekData.map((d) => d.day),
          datasets: [
            {
              label: "Entradas",
              data: weekData.map((d) => d.entradas),
              backgroundColor: "#3B82F6",
              borderColor: "#2563EB",
            },
            {
              label: "Saídas",
              data: weekData.map((d) => d.saidas),
              backgroundColor: "#F97316",
              borderColor: "#EA580C",
            },
          ],
        };
      } else {
        const monthData = await analyticsData.getMonthlyStats();

        current.value = {
          labels: monthData.map((d) => d.day),
          datasets: [
            {
              label: "Entradas",
              data: monthData.map((d) => d.entradas),
              backgroundColor: "#3B82F6",
              borderColor: "#2563EB",
            },
            {
              label: "Saídas",
              data: monthData.map((d) => d.saidas),
              backgroundColor: "#F97316",
              borderColor: "#EA580C",
            },
          ],
        };
      }
    } catch (error) {
      logger.warn("Erro ao carregar dados reais, usando mock:", error);
      current.value = getChartData(period);
    } finally {
      loading.value = false;
    }
  }

  function getChartData(period = "today") {
    if (period === "today") return mock.today;
    if (period === "week") return mock.week;
    return mock.month;
  }

  async function updatePeriod(period: "today" | "week" | "month" = "today") {
    currentPeriod.value = period;

    if (useRealData.value) {
      await loadRealData(period);
    } else {
      current.value = getChartData(period);
    }
  }

  const summary = computed(() => {
    if (!current.value?.datasets || current.value.datasets.length < 2) {
      return [
        { label: "Entradas", value: 0 },
        { label: "Saídas", value: 0 },
        { label: "Diferença", value: 0 },
      ];
    }
    const entradas =
      current.value.datasets[0]?.data?.reduce((a, b) => a + b, 0) ?? 0;
    const saidas =
      current.value.datasets[1]?.data?.reduce((a, b) => a + b, 0) ?? 0;
    return [
      { label: "Entradas", value: entradas },
      { label: "Saídas", value: saidas },
      { label: "Diferença", value: entradas - saidas },
    ];
  });

  // Carregar dados iniciais
  async function initialize() {
    await updatePeriod(currentPeriod.value);
  }

  return {
    current,
    loading,
    currentPeriod,
    useRealData,
    getChartData,
    updatePeriod,
    summary,
    initialize,
  };
});
