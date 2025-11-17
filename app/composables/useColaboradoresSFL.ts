import type {
  Colaborador,
  ColaboradorInput,
  ColaboradorFilter,
} from "~/types/colaborador";
import { logger } from "~/utils/logger";
import { handleDatabaseError } from "~/utils/errorHandler";

export const useColaboradoresSFL = () => {
  const supabase = useSupabaseClient();

  // Teste de conectividade
  const testarConexao = async () => {
    try {
      logger.debug("🧪 Testando conexão com Supabase (SFL)...");

      // Teste simples de conectividade
      const { data, error } = await supabase
        .from("colaboradoressfl")
        .select("count", { count: "exact", head: true });

      logger.debug("🧪 Teste de conectividade SFL - Data:", data);
      logger.debug("🧪 Teste de conectividade SFL - Error:", error);

      return { success: !error, error };
    } catch (err) {
      logger.error("🧪 Erro no teste de conectividade SFL:", err);
      return { success: false, error: err };
    }
  };

  // Estado reativo para lista de colaboradores
  const colaboradoresSFL = ref<Colaborador[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Buscar todos os colaboradores SFL
   */
  const buscarColaboradoresSFL = async (filtros?: ColaboradorFilter) => {
    try {
      logger.info("🔍 Iniciando busca de colaboradores SFL...");

      // Testar conexão primeiro
      await testarConexao();

      loading.value = true;
      error.value = null;

      let query = supabase
        .from("colaboradoressfl")
        .select("*")
        .order("nome", { ascending: true });

      // Aplicar filtros se fornecidos
      if (filtros) {
        logger.debug("🔎 Aplicando filtros:", filtros);
        if (filtros.matricula) {
          query = query.eq("matricula", filtros.matricula);
        }
        if (filtros.nome) {
          query = query.ilike("nome", `%${filtros.nome}%`);
        }
        if (filtros.funcao) {
          query = query.ilike("funcao", `%${filtros.funcao}%`);
        }
        if (filtros.filial) {
          query = query.ilike("filial", `%${filtros.filial}%`);
        }
      }

      logger.debug("📡 Fazendo requisição para Supabase (SFL)...");
      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        const appError = handleDatabaseError(
          supabaseError,
          "useColaboradoresSFL.buscarColaboradoresSFL"
        );
        error.value = appError.userMessage;
        throw new Error(appError.userMessage);
      }

      colaboradoresSFL.value = data || [];
      logger.success(
        "Colaboradores SFL carregados",
        `${colaboradoresSFL.value.length} registros`
      );
      return data || [];
    } catch (err) {
      const appError = handleDatabaseError(
        err,
        "useColaboradoresSFL.buscarColaboradoresSFL"
      );
      error.value = appError.userMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Buscar colaborador por ID
   */
  const buscarColaboradorPorId = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: supabaseError } = await supabase
        .from("colaboradoressfl")
        .select("*")
        .eq("id", id)
        .single();

      if (supabaseError) {
        const appError = handleDatabaseError(
          supabaseError,
          "useColaboradoresSFL.buscarColaboradorPorId"
        );
        error.value = appError.userMessage;
        throw new Error(appError.userMessage);
      }

      return data;
    } catch (err) {
      const appError = handleDatabaseError(
        err,
        "useColaboradoresSFL.buscarColaboradorPorId"
      );
      error.value = appError.userMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Buscar colaborador por matrícula
   */
  const buscarColaboradorPorMatricula = async (matricula: number) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: supabaseError } = await supabase
        .from("colaboradoressfl")
        .select("*")
        .eq("matricula", matricula)
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao buscar colaborador SFL por matrícula";
      error.value = errorMessage;
      console.error("Erro ao buscar colaborador SFL por matrícula:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Atualizar colaborador por ID
   */
  const atualizarColaborador = async (
    id: number,
    dadosAtualizados: Partial<Colaborador>
  ) => {
    try {
      loading.value = true;
      error.value = null;

      console.log("📝 Atualizando colaborador SFL:", id, dadosAtualizados);

      const { data, error: supabaseError } = await supabase
        .from("colaboradoressfl")
        .update(dadosAtualizados)
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Atualizar o colaborador na lista local
      const index = colaboradoresSFL.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        colaboradoresSFL.value[index] = data;
      }

      console.log("✅ Colaborador SFL atualizado:", data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao atualizar colaborador SFL";
      error.value = errorMessage;
      console.error("Erro ao atualizar colaborador SFL:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Criar um novo colaborador
   */
  const criarColaborador = async (dadosColaborador: {
    nome: string;
    funcao?: string;
    matricula?: number;
    filial?: string;
  }) => {
    try {
      loading.value = true;
      error.value = null;

      console.log("➕ Criando novo colaborador SFL:", dadosColaborador);

      const { data, error: supabaseError } = await supabase
        .from("colaboradoressfl")
        .insert([dadosColaborador])
        .select()
        .single();

      if (supabaseError) {
        console.error("Erro do Supabase:", supabaseError);
        throw new Error(
          `Erro ao criar colaborador SFL: ${supabaseError.message}`
        );
      }

      console.log("✅ Colaborador SFL criado:", data);

      // Atualizar lista local
      await buscarColaboradoresSFL();

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar colaborador SFL";
      error.value = errorMessage;
      console.error("Erro ao criar colaborador SFL:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Registrar entrada para um colaborador (cria se não existir)
   */
  const registrarEntrada = async (nome: string, cargo?: string) => {
    try {
      loading.value = true;
      error.value = null;

      // Buscar colaborador por nome
      let colaborador = colaboradoresSFL.value.find(
        (c) => c.nome?.toLowerCase().trim() === nome.toLowerCase().trim()
      );

      // Se não existir, criar novo
      if (!colaborador) {
        colaborador = await criarColaborador({
          nome: nome.trim(),
          funcao: cargo?.trim() || "Não informado",
        });
      }

      // Encontrar primeiro slot de entrada disponível
      let slotDisponivel = null;
      for (let i = 1; i <= 5; i++) {
        const entKey = `ent${i}` as keyof typeof colaborador;
        const saiKey = `sai${i}` as keyof typeof colaborador;

        if (!colaborador[entKey] || !colaborador[saiKey]) {
          slotDisponivel = i;
          break;
        }
      }

      if (!slotDisponivel) {
        throw new Error(
          "Colaborador SFL já tem 5 movimentações registradas hoje"
        );
      }

      // Registrar entrada
      const agora = new Date();
      const dadosAtualizados = {
        [`ent${slotDisponivel}`]: agora.toISOString(),
      };

      await atualizarColaborador(colaborador.id, dadosAtualizados);

      console.log(
        `✅ Entrada SFL registrada para ${nome} no slot ${slotDisponivel}`
      );
      return { colaborador, slot: slotDisponivel };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao registrar entrada SFL";
      error.value = errorMessage;
      console.error("Erro ao registrar entrada SFL:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Registrar saída para um colaborador
   */
  const registrarSaida = async (colaboradorId: number) => {
    try {
      loading.value = true;
      error.value = null;

      const colaborador = colaboradoresSFL.value.find(
        (c) => c.id === colaboradorId
      );
      if (!colaborador) {
        throw new Error("Colaborador SFL não encontrado");
      }

      // Encontrar última entrada sem saída correspondente
      let slotParaSaida = null;
      for (let i = 5; i >= 1; i--) {
        const entKey = `ent${i}` as keyof typeof colaborador;
        const saiKey = `sai${i}` as keyof typeof colaborador;

        if (colaborador[entKey] && !colaborador[saiKey]) {
          slotParaSaida = i;
          break;
        }
      }

      if (!slotParaSaida) {
        throw new Error(
          "Colaborador SFL não tem entrada sem saída correspondente"
        );
      }

      // Registrar saída
      const agora = new Date();
      const dadosAtualizados = {
        [`sai${slotParaSaida}`]: agora.toISOString(),
      };

      await atualizarColaborador(colaboradorId, dadosAtualizados);

      console.log(
        `✅ Saída SFL registrada para ${colaborador.nome} no slot ${slotParaSaida}`
      );
      return { colaborador, slot: slotParaSaida };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao registrar saída SFL";
      error.value = errorMessage;
      console.error("Erro ao registrar saída SFL:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Retornar estado e funções
  return {
    // Estado
    colaboradoresSFL: readonly(colaboradoresSFL),
    loading: readonly(loading),
    error: readonly(error),

    // Funções
    buscarColaboradoresSFL,
    buscarColaboradorPorId,
    buscarColaboradorPorMatricula,
    atualizarColaborador,
    criarColaborador,
    registrarEntrada,
    registrarSaida,
    testarConexao,
  };
};
