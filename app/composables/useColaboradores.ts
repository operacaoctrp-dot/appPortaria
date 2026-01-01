import type {
  Colaborador,
  ColaboradorInput,
  ColaboradorFilter,
} from "~/types/colaborador";
import { logger } from "~/utils/logger";
import { handleDatabaseError } from "~/utils/errorHandler";

export const useColaboradores = () => {
  const supabase = useSupabaseClient();

  // Verificar se o cliente Supabase está disponível
  const isSupabaseAvailable = () => {
    if (!supabase) {
      console.warn('⚠️ Cliente Supabase não disponível - aguardando inicialização');
      return false;
    }
    return true;
  };

  // Teste de conectividade
  const testarConexao = async () => {
    try {
      if (!isSupabaseAvailable()) {
        return { success: false, error: new Error('Cliente Supabase não disponível') };
      }

      logger.debug("🧪 Testando conexão com Supabase...");

      // Teste simples de conectividade
      const { data, error } = await supabase
        .from("colaboradores")
        .select("count", { count: "exact", head: true });

      logger.debug("🧪 Teste de conectividade - Data:", data);
      logger.debug("🧪 Teste de conectividade - Error:", error);

      return { success: !error, error };
    } catch (err) {
      logger.error("🧪 Erro no teste de conectividade:", err);
      return { success: false, error: err };
    }
  };

  // Estado reativo para lista de colaboradores
  const colaboradores = ref<Colaborador[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Buscar todos os colaboradores
   */
  const buscarColaboradores = async (filtros?: ColaboradorFilter) => {
    try {
      if (!isSupabaseAvailable()) {
        error.value = 'Cliente Supabase não disponível';
        return;
      }

      logger.info("🔍 Iniciando busca de colaboradores...");

      // Testar conexão primeiro
      await testarConexao();

      loading.value = true;
      error.value = null;

      let query = supabase
        .from("colaboradores")
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

      logger.debug("📡 Fazendo requisição para Supabase...");
      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        const appError = handleDatabaseError(
          supabaseError,
          "useColaboradores.buscarColaboradores"
        );
        error.value = appError.userMessage;
        throw new Error(appError.userMessage);
      }

      colaboradores.value = data || [];
      logger.success(
        "Colaboradores carregados",
        `${colaboradores.value.length} registros`
      );
      return data || [];
    } catch (err) {
      const appError = handleDatabaseError(
        err,
        "useColaboradores.buscarColaboradores"
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
        .from("colaboradores")
        .select("*")
        .eq("id", id)
        .single();

      if (supabaseError) {
        const appError = handleDatabaseError(
          supabaseError,
          "useColaboradores.buscarColaboradorPorId"
        );
        error.value = appError.userMessage;
        throw new Error(appError.userMessage);
      }

      return data;
    } catch (err) {
      const appError = handleDatabaseError(
        err,
        "useColaboradores.buscarColaboradorPorId"
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
        .from("colaboradores")
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
          : "Erro ao buscar colaborador por matrícula";
      error.value = errorMessage;
      console.error("Erro ao buscar colaborador por matrícula:", err);
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

      console.log("📝 Atualizando colaborador:", id, dadosAtualizados);

      const { data, error: supabaseError } = await supabase
        .from("colaboradores")
        .update(dadosAtualizados)
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Atualizar o colaborador na lista local
      const index = colaboradores.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        colaboradores.value[index] = data;
      }

      console.log("✅ Colaborador atualizado:", data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar colaborador";
      error.value = errorMessage;
      console.error("Erro ao atualizar colaborador:", err);
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

      console.log("➕ Criando novo colaborador:", dadosColaborador);

      const { data, error: supabaseError } = await supabase
        .from("colaboradores")
        .insert([dadosColaborador])
        .select()
        .single();

      if (supabaseError) {
        console.error("Erro do Supabase:", supabaseError);
        throw new Error(`Erro ao criar colaborador: ${supabaseError.message}`);
      }

      console.log("✅ Colaborador criado:", data);

      // Atualizar lista local
      await buscarColaboradores();

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar colaborador";
      error.value = errorMessage;
      console.error("Erro ao criar colaborador:", err);
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
      let colaborador = colaboradores.value.find(
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
        throw new Error("Colaborador já tem 5 movimentações registradas hoje");
      }

      // Registrar entrada
      const agora = new Date();
      const dadosAtualizados = {
        [`ent${slotDisponivel}`]: agora.toISOString(),
      };

      await atualizarColaborador(colaborador.id, dadosAtualizados);

      console.log(
        `✅ Entrada registrada para ${nome} no slot ${slotDisponivel}`
      );
      return { colaborador, slot: slotDisponivel };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao registrar entrada";
      error.value = errorMessage;
      console.error("Erro ao registrar entrada:", err);
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

      const colaborador = colaboradores.value.find(
        (c) => c.id === colaboradorId
      );
      if (!colaborador) {
        throw new Error("Colaborador não encontrado");
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
        throw new Error("Colaborador não tem entrada sem saída correspondente");
      }

      // Registrar saída
      const agora = new Date();
      const dadosAtualizados = {
        [`sai${slotParaSaida}`]: agora.toISOString(),
      };

      await atualizarColaborador(colaboradorId, dadosAtualizados);

      console.log(
        `✅ Saída registrada para ${colaborador.nome} no slot ${slotParaSaida}`
      );
      return { colaborador, slot: slotParaSaida };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao registrar saída";
      error.value = errorMessage;
      console.error("Erro ao registrar saída:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Retornar estado e funções
  return {
    // Estado
    colaboradores: readonly(colaboradores),
    loading: readonly(loading),
    error: readonly(error),

    // Funções
    buscarColaboradores,
    buscarColaboradorPorId,
    buscarColaboradorPorMatricula,
    atualizarColaborador,
    criarColaborador,
    registrarEntrada,
    registrarSaida,
    testarConexao,
  };
};
