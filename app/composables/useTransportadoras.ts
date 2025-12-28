import type {
  Colaborador,
  ColaboradorInput,
  ColaboradorFilter,
} from "~/types/colaborador";
import { logger } from "~/utils/logger";
import { handleDatabaseError } from "~/utils/errorHandler";

export const useTransportadoras = () => {
  const supabase = useSupabaseClient();
  const supabaseAny = supabase as any; // Para usar tabela não tipada

  // Estado reativo para lista de transportadoras
  const transportadoras = ref<Colaborador[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Buscar todas as transportadoras
   */
  const buscarTransportadoras = async (filtros?: ColaboradorFilter) => {
    try {
      logger.info("🔍 Iniciando busca de transportadoras...");

      loading.value = true;
      error.value = null;

      let query = supabaseAny
        .from("colaboradorestransp")
        .select("*")
        .order("nome", { ascending: true });

      // Aplicar filtros se fornecidos
      if (filtros) {
        logger.debug("🔎 Aplicando filtros:", filtros);
        if (filtros.nome) {
          query = query.ilike("nome", `%${filtros.nome}%`);
        }
        if (filtros.funcao) {
          query = query.ilike("funcao", `%${filtros.funcao}%`);
        }
      }

      logger.debug("📡 Fazendo requisição para Supabase...");
      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        const appError = handleDatabaseError(
          supabaseError,
          "useTransportadoras.buscarTransportadoras"
        );
        error.value = appError.userMessage;
        throw new Error(appError.userMessage);
      }

      transportadoras.value = data || [];
      logger.success(
        "Transportadoras carregadas",
        `${transportadoras.value.length} registros`
      );
      return data || [];
    } catch (err) {
      const appError = handleDatabaseError(
        err,
        "useTransportadoras.buscarTransportadoras"
      );
      error.value = appError.userMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Atualizar uma transportadora
   */
  const atualizarTransportadora = async (
    id: number,
    dados: Partial<ColaboradorInput>
  ) => {
    try {
      logger.info(`📝 Atualizando transportadora ID: ${id}`, dados);
      loading.value = true;
      error.value = null;

      const { data, error: supabaseError } = await supabaseAny
        .from("colaboradorestransp")
        .update(dados)
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) {
        const appError = handleDatabaseError(
          supabaseError,
          "useTransportadoras.atualizarTransportadora"
        );
        error.value = appError.userMessage;
        throw new Error(appError.userMessage);
      }

      // Atualizar no array local
      const index = transportadoras.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        transportadoras.value[index] = data;
      }

      logger.success("Transportadora atualizada", `ID: ${id}`);
      return data;
    } catch (err) {
      const appError = handleDatabaseError(
        err,
        "useTransportadoras.atualizarTransportadora"
      );
      error.value = appError.userMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Criar uma nova transportadora
   */
  const criarTransportadora = async (dados: Partial<ColaboradorInput>) => {
    try {
      logger.info("➕ Criando nova transportadora:", dados);
      loading.value = true;
      error.value = null;

      const { data, error: supabaseError } = await supabaseAny
        .from("colaboradorestransp")
        .insert(dados)
        .select()
        .single();

      if (supabaseError) {
        const appError = handleDatabaseError(
          supabaseError,
          "useTransportadoras.criarTransportadora"
        );
        error.value = appError.userMessage;
        throw new Error(appError.userMessage);
      }

      // Adicionar ao array local
      transportadoras.value.push(data);

      logger.success("Transportadora criada", `ID: ${data.id}`);
      return data;
    } catch (err) {
      const appError = handleDatabaseError(
        err,
        "useTransportadoras.criarTransportadora"
      );
      error.value = appError.userMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    transportadoras,
    loading,
    error,
    buscarTransportadoras,
    atualizarTransportadora,
    criarTransportadora,
  };
};
