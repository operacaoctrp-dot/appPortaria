import { defineStore } from "pinia";
import type {
  Colaborador,
  ColaboradorInput,
  ColaboradorFilter,
} from "~/types/colaborador";
import { CACHE_TTL, STORAGE_KEYS } from "~/constants/app";
import { cache, withCache } from "~/utils/cache";
import { logger } from "~/utils/logger";
import { handleDatabaseError } from "~/utils/errorHandler";

interface ColaboradoresState {
  colaboradores: Colaborador[];
  funcionariosPresentes: Colaborador[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  filters: ColaboradorFilter;
}

export const useColaboradoresStore = defineStore("colaboradores", {
  state: (): ColaboradoresState => ({
    colaboradores: [],
    funcionariosPresentes: [],
    loading: false,
    error: null,
    lastUpdate: null,
    filters: {},
  }),

  getters: {
    /**
     * Colaboradores filtrados
     */
    colaboradoresFiltrados: (state) => {
      let resultado = state.colaboradores;

      if (state.filters.nome) {
        resultado = resultado.filter((c) =>
          c.nome?.toLowerCase().includes(state.filters.nome!.toLowerCase())
        );
      }

      if (state.filters.funcao) {
        resultado = resultado.filter((c) =>
          c.funcao?.toLowerCase().includes(state.filters.funcao!.toLowerCase())
        );
      }

      if (state.filters.filial) {
        resultado = resultado.filter((c) =>
          c.filial?.toLowerCase().includes(state.filters.filial!.toLowerCase())
        );
      }

      if (state.filters.matricula) {
        resultado = resultado.filter(
          (c) => c.matricula === state.filters.matricula
        );
      }

      return resultado;
    },

    /**
     * Estatísticas gerais
     */
    estatisticas: (state) => ({
      totalColaboradores: state.colaboradores.length,
      funcionariosPresentes: state.funcionariosPresentes.length,
      funcionariosAusentes:
        state.colaboradores.length - state.funcionariosPresentes.length,
      percentualPresenca:
        state.colaboradores.length > 0
          ? Math.round(
              (state.funcionariosPresentes.length /
                state.colaboradores.length) *
                100
            )
          : 0,
    }),

    /**
     * Verificar se deve atualizar cache
     */
    shouldRefresh: (state) => {
      if (!state.lastUpdate) return true;
      const now = new Date().getTime();
      const lastUpdate = state.lastUpdate.getTime();
      return now - lastUpdate > CACHE_TTL.COLABORADORES;
    },
  },

  actions: {
    /**
     * Buscar todos os colaboradores
     */
    async fetchColaboradores(forceRefresh = false) {
      // Se já temos dados recentes e não é refresh forçado, usar cache
      if (
        !forceRefresh &&
        !this.shouldRefresh &&
        this.colaboradores.length > 0
      ) {
        return this.colaboradores;
      }

      this.loading = true;
      this.error = null;

      try {
        const data = await withCache(
          STORAGE_KEYS.COLABORADORES_CACHE,
          async () => {
            const supabase = useSupabaseClient();
            const { data, error } = await supabase
              .from("colaboradores")
              .select("*")
              .order("nome", { ascending: true });

            if (error) throw error;
            return data || [];
          },
          forceRefresh ? 0 : CACHE_TTL.COLABORADORES
        );

        this.colaboradores = data;
        this.lastUpdate = new Date();
        this.atualizarFuncionariosPresentes();

        return data;
      } catch (error: any) {
        const appError = handleDatabaseError(
          error,
          "ColaboradoresStore.fetchColaboradores"
        );
        this.error = appError.userMessage;
        logger.error("Erro no store:", appError.userMessage);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Buscar colaborador por ID
     */
    async fetchColaboradorById(id: number) {
      // Tentar encontrar nos dados já carregados
      const existente = this.colaboradores.find((c) => c.id === id);
      if (existente) return existente;

      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase
          .from("colaboradores")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data;
      } catch (error: any) {
        const appError = handleDatabaseError(
          error,
          "ColaboradoresStore.fetchColaboradorById"
        );
        logger.error("Erro ao buscar colaborador:", appError.userMessage);
        throw error;
      }
    },

    /**
     * Criar novo colaborador
     */
    async criarColaborador(dados: ColaboradorInput) {
      this.loading = true;
      this.error = null;

      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase
          .from("colaboradores")
          .insert([dados])
          .select()
          .single();

        if (error) throw error;

        // Adicionar aos dados locais
        this.colaboradores.push(data);
        this.invalidarCache();

        return data;
      } catch (error: any) {
        const appError = handleDatabaseError(
          error,
          "ColaboradoresStore.criarColaborador"
        );
        this.error = appError.userMessage;
        logger.error("Erro ao criar colaborador:", appError.userMessage);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Registrar entrada
     */
    async registrarEntrada(nome: string, cargo?: string) {
      this.loading = true;
      this.error = null;

      try {
        const supabase = useSupabaseClient();

        // Buscar ou criar colaborador
        let colaborador = this.colaboradores.find(
          (c) => c.nome?.toLowerCase() === nome.toLowerCase()
        );

        if (!colaborador) {
          // Criar novo colaborador
          const { data: novoColaborador, error: createError } = await supabase
            .from("colaboradores")
            .insert([{ nome, funcao: cargo }])
            .select()
            .single();

          if (createError) throw createError;
          colaborador = novoColaborador;
          this.colaboradores.push(colaborador);
        }

        // Registrar entrada no próximo slot disponível
        const updates: any = {};
        const agora = new Date().toISOString();

        for (let i = 1; i <= 5; i++) {
          const entKey = `ent${i}` as keyof Colaborador;
          const saiKey = `sai${i}` as keyof Colaborador;

          if (!colaborador[entKey] || colaborador[saiKey]) {
            updates[entKey] = agora;
            if (colaborador[saiKey]) {
              updates[saiKey] = null; // Limpar saída se estava registrada
            }
            break;
          }
        }

        if (Object.keys(updates).length === 0) {
          throw new Error("Limite de entradas excedido para hoje");
        }

        // Atualizar no banco
        const { data: updatedData, error: updateError } = await supabase
          .from("colaboradores")
          .update(updates)
          .eq("id", colaborador.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Atualizar dados locais
        const index = this.colaboradores.findIndex(
          (c) => c.id === colaborador!.id
        );
        if (index !== -1) {
          this.colaboradores[index] = updatedData;
        }

        this.atualizarFuncionariosPresentes();
        this.invalidarCache();

        return updatedData;
      } catch (error: any) {
        const appError = handleDatabaseError(
          error,
          "ColaboradoresStore.registrarEntrada"
        );
        this.error = appError.userMessage;
        logger.error("Erro ao registrar entrada:", appError.userMessage);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Registrar saída
     */
    async registrarSaida(colaboradorId: number) {
      this.loading = true;
      this.error = null;

      try {
        const supabase = useSupabaseClient();
        const colaborador = this.colaboradores.find(
          (c) => c.id === colaboradorId
        );

        if (!colaborador) {
          throw new Error("Colaborador não encontrado");
        }

        // Encontrar a última entrada sem saída
        const updates: any = {};
        const agora = new Date().toISOString();

        for (let i = 5; i >= 1; i--) {
          const entKey = `ent${i}` as keyof Colaborador;
          const saiKey = `sai${i}` as keyof Colaborador;

          if (colaborador[entKey] && !colaborador[saiKey]) {
            updates[saiKey] = agora;
            break;
          }
        }

        if (Object.keys(updates).length === 0) {
          throw new Error("Nenhuma entrada em aberto encontrada");
        }

        // Atualizar no banco
        const { data: updatedData, error: updateError } = await supabase
          .from("colaboradores")
          .update(updates)
          .eq("id", colaboradorId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Atualizar dados locais
        const index = this.colaboradores.findIndex(
          (c) => c.id === colaboradorId
        );
        if (index !== -1) {
          this.colaboradores[index] = updatedData;
        }

        this.atualizarFuncionariosPresentes();
        this.invalidarCache();

        return updatedData;
      } catch (error: any) {
        const appError = handleDatabaseError(
          error,
          "ColaboradoresStore.registrarSaida"
        );
        this.error = appError.userMessage;
        logger.error("Erro ao registrar saída:", appError.userMessage);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Atualizar lista de funcionários presentes
     */
    atualizarFuncionariosPresentes() {
      this.funcionariosPresentes = this.colaboradores.filter((colaborador) => {
        // Verificar se tem alguma entrada sem saída correspondente
        for (let i = 1; i <= 5; i++) {
          const entrada = colaborador[`ent${i}` as keyof Colaborador];
          const saida = colaborador[`sai${i}` as keyof Colaborador];

          if (entrada && !saida) {
            return true;
          }
        }
        return false;
      });
    },

    /**
     * Aplicar filtros
     */
    setFiltros(filtros: ColaboradorFilter) {
      this.filters = { ...filtros };
    },

    /**
     * Limpar filtros
     */
    limparFiltros() {
      this.filters = {};
    },

    /**
     * Invalidar cache
     */
    invalidarCache() {
      cache.remove(STORAGE_KEYS.COLABORADORES_CACHE);
      this.lastUpdate = null;
    },

    /**
     * Limpar dados
     */
    limparDados() {
      this.colaboradores = [];
      this.funcionariosPresentes = [];
      this.error = null;
      this.lastUpdate = null;
      this.invalidarCache();
    },
  },
});
