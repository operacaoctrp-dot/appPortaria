import { ref } from "vue";
import type { Database } from "@/types/database.types";

type ColaboradorRow = Database["public"]["Tables"]["colaboradores"]["Row"];

interface PeriodStats {
  totalEntradas: number;
  totalSaidas: number;
  diferenca: number;
}

interface HourlyStats {
  hour: string;
  entradas: number;
  saidas: number;
}

interface DailyStats {
  date: string;
  day: string;
  entradas: number;
  saidas: number;
}

interface TopColaborador {
  nome: string;
  totalMovimentacoes: number;
}

export const useAnalyticsData = () => {
  const supabase = useSupabaseClient<Database>();
  const cache = useCache();
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Busca estatísticas do período (hoje, semana ou mês)
   */
  const getPeriodStats = async (
    period: "today" | "week" | "month" = "today"
  ): Promise<PeriodStats> => {
    // Verificar cache
    const cacheKey = `period-stats-${period}`;
    const cached = cache.get<PeriodStats>(cacheKey);
    if (cached) {
      return cached;
    }

    loading.value = true;
    error.value = null;

    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
      }

      const { data, error: queryError } = await supabase
        .from("colaboradores")
        .select("ent1, sai1, ent2, sai2, ent3, sai3, ent4, sai4, ent5, sai5")
        .gte("created_at", startDate.toISOString());

      if (queryError) throw queryError;

      let totalEntradas = 0;
      let totalSaidas = 0;

      data?.forEach((row) => {
        // Contar entradas (ent1 a ent5)
        if (row.ent1) totalEntradas++;
        if (row.ent2) totalEntradas++;
        if (row.ent3) totalEntradas++;
        if (row.ent4) totalEntradas++;
        if (row.ent5) totalEntradas++;

        // Contar saídas (sai1 a sai5)
        if (row.sai1) totalSaidas++;
        if (row.sai2) totalSaidas++;
        if (row.sai3) totalSaidas++;
        if (row.sai4) totalSaidas++;
        if (row.sai5) totalSaidas++;
      });

      const result = {
        totalEntradas,
        totalSaidas,
        diferenca: totalEntradas - totalSaidas,
      };

      // Armazenar no cache (5 minutos)
      cache.set(cacheKey, result, 5 * 60 * 1000);

      return result;
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
      error.value = "Erro ao carregar estatísticas";
      return { totalEntradas: 0, totalSaidas: 0, diferenca: 0 };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca movimentações por hora (para gráfico do dia)
   */
  const getHourlyStats = async (): Promise<HourlyStats[]> => {
    // Verificar cache
    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `hourly-stats-${today}`;
    const cached = cache.get<HourlyStats[]>(cacheKey);
    if (cached) {
      return cached;
    }

    loading.value = true;
    error.value = null;

    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error: queryError } = await supabase
        .from("colaboradores")
        .select("ent1, sai1, ent2, sai2, ent3, sai3, ent4, sai4, ent5, sai5")
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);

      if (queryError) throw queryError;

      // Inicializar contadores por hora (6h às 20h)
      const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6h até 20h
      const stats: Record<number, { entradas: number; saidas: number }> = {};

      hours.forEach((h) => {
        stats[h] = { entradas: 0, saidas: 0 };
      });

      // Processar dados
      data?.forEach((row) => {
        // Processar entradas
        [row.ent1, row.ent2, row.ent3, row.ent4, row.ent5].forEach((ent) => {
          if (ent) {
            const hour = new Date(ent).getHours();
            if (stats[hour]) stats[hour].entradas++;
          }
        });

        // Processar saídas
        [row.sai1, row.sai2, row.sai3, row.sai4, row.sai5].forEach((sai) => {
          if (sai) {
            const hour = new Date(sai).getHours();
            if (stats[hour]) stats[hour].saidas++;
          }
        });
      });

      const result = hours.map((h) => ({
        hour: `${h.toString().padStart(2, "0")}h`,
        entradas: stats[h]?.entradas || 0,
        saidas: stats[h]?.saidas || 0,
      }));

      // Cache de 2 minutos (dados do dia mudam frequentemente)
      cache.set(cacheKey, result, 2 * 60 * 1000);

      return result;
    } catch (err) {
      console.error("Erro ao buscar estatísticas horárias:", err);
      error.value = "Erro ao carregar gráfico";
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca movimentações por dia da semana
   */
  const getWeeklyStats = async (): Promise<DailyStats[]> => {
    loading.value = true;
    error.value = null;

    try {
      const now = new Date();
      const startDate = new Date(now.setDate(now.getDate() - 7));

      const { data, error: queryError } = await supabase
        .from("colaboradores")
        .select(
          "created_at, ent1, sai1, ent2, sai2, ent3, sai3, ent4, sai4, ent5, sai5"
        )
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (queryError) throw queryError;

      const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const dailyStats = new Map<
        string,
        { entradas: number; saidas: number }
      >();

      data?.forEach((row) => {
        const date = row.created_at?.split("T")[0] || "";
        if (!dailyStats.has(date)) {
          dailyStats.set(date, { entradas: 0, saidas: 0 });
        }

        const stats = dailyStats.get(date)!;

        // Contar entradas
        if (row.ent1) stats.entradas++;
        if (row.ent2) stats.entradas++;
        if (row.ent3) stats.entradas++;
        if (row.ent4) stats.entradas++;
        if (row.ent5) stats.entradas++;

        // Contar saídas
        if (row.sai1) stats.saidas++;
        if (row.sai2) stats.saidas++;
        if (row.sai3) stats.saidas++;
        if (row.sai4) stats.saidas++;
        if (row.sai5) stats.saidas++;
      });

      return Array.from(dailyStats.entries()).map(([date, stats]) => {
        const dayOfWeek = new Date(date).getDay();
        return {
          date,
          day: dayNames[dayOfWeek] || "N/A",
          entradas: stats.entradas,
          saidas: stats.saidas,
        };
      });
    } catch (err) {
      console.error("Erro ao buscar estatísticas semanais:", err);
      error.value = "Erro ao carregar gráfico semanal";
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca movimentações por semana do mês
   */
  const getMonthlyStats = async (): Promise<DailyStats[]> => {
    loading.value = true;
    error.value = null;

    try {
      const now = new Date();
      const startDate = new Date(now.setDate(now.getDate() - 30));

      const { data, error: queryError } = await supabase
        .from("colaboradores")
        .select(
          "created_at, ent1, sai1, ent2, sai2, ent3, sai3, ent4, sai4, ent5, sai5"
        )
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (queryError) throw queryError;

      // Agrupar por semana
      const weeklyStats = new Map<
        number,
        { entradas: number; saidas: number }
      >();

      data?.forEach((row) => {
        const date = new Date(row.created_at || "");
        const weekNumber = Math.ceil(date.getDate() / 7);

        if (!weeklyStats.has(weekNumber)) {
          weeklyStats.set(weekNumber, { entradas: 0, saidas: 0 });
        }

        const stats = weeklyStats.get(weekNumber)!;

        // Contar entradas
        if (row.ent1) stats.entradas++;
        if (row.ent2) stats.entradas++;
        if (row.ent3) stats.entradas++;
        if (row.ent4) stats.entradas++;
        if (row.ent5) stats.entradas++;

        // Contar saídas
        if (row.sai1) stats.saidas++;
        if (row.sai2) stats.saidas++;
        if (row.sai3) stats.saidas++;
        if (row.sai4) stats.saidas++;
        if (row.sai5) stats.saidas++;
      });

      return Array.from(weeklyStats.entries()).map(([week, stats]) => ({
        date: `Sem ${week}`,
        day: `Sem ${week}`,
        entradas: stats.entradas,
        saidas: stats.saidas,
      }));
    } catch (err) {
      console.error("Erro ao buscar estatísticas mensais:", err);
      error.value = "Erro ao carregar gráfico mensal";
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca colaboradores mais frequentes
   */
  const getTopColaboradores = async (limit = 10): Promise<TopColaborador[]> => {
    loading.value = true;
    error.value = null;

    try {
      const now = new Date();
      const startDate = new Date(now.setDate(now.getDate() - 30));

      const { data, error: queryError } = await supabase
        .from("colaboradores")
        .select(
          "nome, ent1, sai1, ent2, sai2, ent3, sai3, ent4, sai4, ent5, sai5"
        )
        .gte("created_at", startDate.toISOString());

      if (queryError) throw queryError;

      const colaboradoresMap = new Map<string, number>();

      data?.forEach((row) => {
        const nome = row.nome || "Sem nome";
        let movimentacoes = 0;

        // Contar todas as movimentações
        if (row.ent1) movimentacoes++;
        if (row.sai1) movimentacoes++;
        if (row.ent2) movimentacoes++;
        if (row.sai2) movimentacoes++;
        if (row.ent3) movimentacoes++;
        if (row.sai3) movimentacoes++;
        if (row.ent4) movimentacoes++;
        if (row.sai4) movimentacoes++;
        if (row.ent5) movimentacoes++;
        if (row.sai5) movimentacoes++;

        colaboradoresMap.set(
          nome,
          (colaboradoresMap.get(nome) || 0) + movimentacoes
        );
      });

      return Array.from(colaboradoresMap.entries())
        .map(([nome, totalMovimentacoes]) => ({ nome, totalMovimentacoes }))
        .sort((a, b) => b.totalMovimentacoes - a.totalMovimentacoes)
        .slice(0, limit);
    } catch (err) {
      console.error("Erro ao buscar top colaboradores:", err);
      error.value = "Erro ao carregar ranking";
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    getPeriodStats,
    getHourlyStats,
    getWeeklyStats,
    getMonthlyStats,
    getTopColaboradores,
  };
};
