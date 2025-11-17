import type { Database } from "@/types/database.types";
import { logger } from "~/utils/logger";
import {
  handleDatabaseError,
  isTableNotFoundError,
} from "~/utils/errorHandler";

type ColaboradorRow = Database["public"]["Tables"]["colaboradores"]["Row"];

interface RegistroMovimentacao {
  id: number;
  colaborador_id: number;
  nome: string;
  funcao: string | null;
  filial: string | null;
  matricula: number | null;
  tipo: "entrada" | "saida";
  hora: string;
  data: string;
}

interface ResumoColaboradorDia {
  colaborador_id: number;
  nome: string;
  funcao: string | null;
  filial: string | null;
  matricula: number | null;
  entradas: string[];
  saidas: string[];
  presente: boolean;
}

export const useHistoricoMovimentacao = () => {
  const supabase = useSupabaseClient<Database>();
  const supabaseAny: any = useSupabaseClient(); // Para tabelas não tipadas (sem validação de tipos)
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Registra uma entrada ou saída para um colaborador
   * Atualiza AMBAS as tabelas: colaboradores (dia atual) E colaboradores_historico
   */
  const registrarMovimentacao = async (
    colaboradorId: number,
    tipo: "entrada" | "saida"
  ): Promise<{ success: boolean; error?: string }> => {
    loading.value = true;
    error.value = null;

    try {
      logger.info(`🔄 Registrando ${tipo} para colaborador ${colaboradorId}`);

      // 1. Buscar dados atuais do colaborador
      const { data: colaborador, error: fetchError } = await supabase
        .from("colaboradores")
        .select("*")
        .eq("id", colaboradorId)
        .single();

      if (fetchError || !colaborador) {
        throw new Error("Colaborador não encontrado");
      }

      const agora = new Date().toISOString();
      const hoje = new Date().toISOString().split("T")[0];

      // 2. Encontrar próximo slot disponível (ent1-ent5 ou sai1-sai5)
      const slots =
        tipo === "entrada"
          ? ["ent1", "ent2", "ent3", "ent4", "ent5"]
          : ["sai1", "sai2", "sai3", "sai4", "sai5"];

      let slotDisponivel: string | null = null;

      for (const slot of slots) {
        if (!colaborador[slot as keyof ColaboradorRow]) {
          slotDisponivel = slot;
          break;
        }
      }

      if (!slotDisponivel) {
        throw new Error(
          `Limite de ${tipo}s atingido (máximo 5 por dia). Crie um novo registro para amanhã.`
        );
      }

      console.log(`✅ Slot disponível encontrado: ${slotDisponivel}`);

      // 3. Atualizar tabela colaboradores (registro do dia atual)
      const updateData: any = {
        [slotDisponivel]: agora,
      };

      const { error: updateError } = await supabase
        .from("colaboradores")
        .update(updateData)
        .eq("id", colaboradorId);

      if (updateError) {
        throw new Error(
          `Erro ao atualizar colaborador: ${updateError.message}`
        );
      }

      console.log("✅ Tabela colaboradores atualizada");

      // 4. Buscar ou criar registro no histórico
      const { data: historicoExistente, error: historicoFetchError } =
        await supabaseAny
          .from("colaboradores_historico")
          .select("*")
          .eq("colaborador_id", colaboradorId)
          .eq("data_registro", hoje)
          .eq("origem", "principal")
          .maybeSingle();

      if (historicoFetchError && historicoFetchError.code !== "PGRST116") {
        console.error("Erro ao buscar histórico:", historicoFetchError);
      }

      if (historicoExistente) {
        // Atualizar registro existente
        console.log("📝 Atualizando histórico existente");

        const { error: historicoUpdateError } = await supabaseAny
          .from("colaboradores_historico")
          .update({
            [slotDisponivel]: agora,
            updated_at: agora,
          })
          .eq("id", historicoExistente.id);

        if (historicoUpdateError) {
          console.error("Erro ao atualizar histórico:", historicoUpdateError);
        }
      } else {
        // Criar novo registro no histórico
        console.log("➕ Criando novo registro no histórico");

        const { error: historicoInsertError } = await supabaseAny
          .from("colaboradores_historico")
          .insert({
            colaborador_id: colaboradorId,
            data_registro: hoje,
            origem: "principal",
            nome: colaborador.nome,
            funcao: colaborador.funcao,
            filial: colaborador.filial,
            matricula: colaborador.matricula?.toString() || null,
            [slotDisponivel]: agora,
          });

        if (historicoInsertError) {
          console.error("Erro ao inserir histórico:", historicoInsertError);
        }
      }

      console.log(`✅ ${tipo} registrada com sucesso!`);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || `Erro ao registrar ${tipo}`;
      error.value = errorMessage;
      console.error(`❌ Erro ao registrar ${tipo}:`, err);
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca todas as movimentações de um dia específico
   */
  const buscarMovimentacoesDia = async (
    data: string
  ): Promise<RegistroMovimentacao[]> => {
    loading.value = true;
    error.value = null;

    try {
      console.log(`🔍 Buscando movimentações do dia: ${data}`);

      // SEMPRE buscar do histórico, pois é lá que as movimentações são registradas
      console.log("🗄️ Buscando do histórico (tabela colaboradores_historico)");

      const { data: historico, error: fetchError } = await supabaseAny
        .from("colaboradores_historico")
        .select("*")
        .eq("data_registro", data)
        .eq("origem", "principal")
        .order("nome", { ascending: true });

      if (fetchError) {
        console.error("❌ Erro ao buscar histórico:", fetchError);

        // Se a tabela não existe, retornar array vazio
        if (
          fetchError.code === "42P01" ||
          fetchError.message?.includes("does not exist")
        ) {
          console.warn(
            "⚠️ Tabela colaboradores_historico não existe. Execute o SQL em database/create_historico_table.sql"
          );
          return [];
        }

        throw fetchError;
      }

      console.log(
        `📋 Encontrados ${historico?.length || 0} registros no histórico`
      );
      const movimentacoes = processarMovimentacoes(historico || []);
      console.log(
        `✅ Processadas ${movimentacoes.length} movimentações individuais`
      );
      return movimentacoes;
    } catch (err: any) {
      error.value = err.message || "Erro ao buscar movimentações";
      console.error("❌ Erro ao buscar movimentações:", err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Processa registros e extrai todas as movimentações
   */
  const processarMovimentacoes = (registros: any[]): RegistroMovimentacao[] => {
    const movimentacoes: RegistroMovimentacao[] = [];

    registros.forEach((registro) => {
      const colaboradorId = registro.colaborador_id || registro.id;
      const nome = registro.nome || "Sem nome";
      const funcao = registro.funcao;
      const filial = registro.filial;
      const matricula = registro.matricula;

      // Processar entradas (ent1 a ent5)
      for (let i = 1; i <= 5; i++) {
        const campo = `ent${i}` as keyof typeof registro;
        const valor = registro[campo];

        if (valor) {
          movimentacoes.push({
            id: movimentacoes.length + 1,
            colaborador_id: colaboradorId,
            nome,
            funcao,
            filial,
            matricula,
            tipo: "entrada",
            hora: valor,
            data: valor.split("T")[0],
          });
        }
      }

      // Processar saídas (sai1 a sai5)
      for (let i = 1; i <= 5; i++) {
        const campo = `sai${i}` as keyof typeof registro;
        const valor = registro[campo];

        if (valor) {
          movimentacoes.push({
            id: movimentacoes.length + 1,
            colaborador_id: colaboradorId,
            nome,
            funcao,
            filial,
            matricula,
            tipo: "saida",
            hora: valor,
            data: valor.split("T")[0],
          });
        }
      }
    });

    // Ordenar por horário (mais recente primeiro)
    return movimentacoes.sort(
      (a, b) => new Date(b.hora).getTime() - new Date(a.hora).getTime()
    );
  };

  /**
   * Busca resumo dos colaboradores em um dia específico
   */
  const buscarResumoColaboradoresDia = async (
    data: string
  ): Promise<ResumoColaboradorDia[]> => {
    loading.value = true;
    error.value = null;

    try {
      console.log(`📊 Buscando resumo do dia: ${data}`);

      const hoje = new Date().toISOString().split("T")[0];
      const ehHoje = data === hoje;

      console.log(`📅 É hoje? ${ehHoje} (hoje: ${hoje}, data: ${data})`);

      let registros: any[] = [];

      // SEMPRE buscar do histórico, pois é lá que as entradas/saídas são registradas
      console.log("🗄️ Buscando da tabela colaboradores_historico...");
      const { data: historico, error: fetchError } = await supabaseAny
        .from("colaboradores_historico")
        .select("*")
        .eq("data_registro", data)
        .eq("origem", "principal")
        .order("nome", { ascending: true });

      if (fetchError) {
        console.error("❌ Erro ao buscar histórico:", fetchError);
        throw fetchError;
      }

      registros = historico || [];
      console.log(`📋 Encontrados ${registros.length} registros no histórico`);

      const resumo = registros.map((registro) => {
        const entradas: string[] = [];
        const saidas: string[] = [];

        // Coletar entradas
        for (let i = 1; i <= 5; i++) {
          const campo = `ent${i}` as keyof typeof registro;
          if (registro[campo]) entradas.push(registro[campo]);
        }

        // Coletar saídas
        for (let i = 1; i <= 5; i++) {
          const campo = `sai${i}` as keyof typeof registro;
          if (registro[campo]) saidas.push(registro[campo]);
        }

        // Está presente se tem mais entradas que saídas
        const presente = entradas.length > saidas.length;

        const resumoColaborador = {
          colaborador_id: registro.colaborador_id || registro.id,
          nome: registro.nome || "Sem nome",
          funcao: registro.funcao,
          filial: registro.filial,
          matricula: registro.matricula,
          entradas,
          saidas,
          presente,
        };

        console.log(`📝 Resumo de ${resumoColaborador.nome}:`, {
          entradas: entradas.length,
          saidas: saidas.length,
          presente,
          campos_entrada: {
            ent1: registro.ent1,
            ent2: registro.ent2,
            ent3: registro.ent3,
            ent4: registro.ent4,
            ent5: registro.ent5,
          },
          campos_saida: {
            sai1: registro.sai1,
            sai2: registro.sai2,
            sai3: registro.sai3,
            sai4: registro.sai4,
            sai5: registro.sai5,
          },
        });

        return resumoColaborador;
      });

      console.log(`✅ Resumo processado: ${resumo.length} colaboradores`);
      console.log(
        `✅ Funcionários presentes: ${resumo.filter((r) => r.presente).length}`
      );
      return resumo;
    } catch (err: any) {
      error.value = err.message || "Erro ao buscar resumo";
      console.error("❌ Erro ao buscar resumo:", err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Limpa os registros do dia atual (para iniciar novo dia)
   */
  const limparRegistrosDiaAtual = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    loading.value = true;
    error.value = null;

    try {
      console.log("🧹 Limpando registros do dia atual...");

      // Limpar apenas os campos de entrada/saída, manter dados do colaborador
      const { error: updateError } = await supabase
        .from("colaboradores")
        .update({
          ent1: null,
          sai1: null,
          ent2: null,
          sai2: null,
          ent3: null,
          sai3: null,
          ent4: null,
          sai4: null,
          ent5: null,
          sai5: null,
        })
        .neq("id", 0); // Atualiza todos os registros

      if (updateError) throw updateError;

      console.log("✅ Registros limpos com sucesso");
      return { success: true };
    } catch (err: any) {
      error.value = err.message || "Erro ao limpar registros";
      console.error("❌ Erro ao limpar registros:", err);
      return { success: false, error: error.value || undefined };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca históricos de uma data específica (alias para buscarMovimentacoesDia)
   */
  const buscarHistoricoPorData = async (data: string) => {
    const movimentacoes = await buscarMovimentacoesDia(data);
    return { historicos: movimentacoes, error: error.value };
  };

  /**
   * Busca históricos de uma data e retorna no formato esperado
   */
  const buscarHistoricosPorData = async (data: string) => {
    try {
      const hoje = new Date().toISOString().split("T")[0];
      const ehHoje = data === hoje;

      if (ehHoje) {
        // Para hoje, retornar dados da tabela colaboradores
        const { data: colaboradores, error: fetchError } = await supabase
          .from("colaboradores")
          .select("*")
          .order("nome", { ascending: true });

        if (fetchError) {
          return { historicos: [], error: fetchError.message };
        }

        return { historicos: colaboradores || [], error: null };
      } else {
        // Para outros dias, buscar do histórico
        const { data: historico, error: fetchError } = await supabaseAny
          .from("colaboradores_historico")
          .select("*")
          .eq("data_registro", data)
          .order("nome", { ascending: true });

        if (fetchError) {
          // Se a tabela não existe, retornar array vazio sem erro
          if (
            fetchError.code === "42P01" ||
            fetchError.message?.includes("does not exist")
          ) {
            console.warn("⚠️ Tabela colaboradores_historico não existe");
            return { historicos: [], error: null };
          }
          return { historicos: [], error: fetchError.message };
        }

        return { historicos: historico || [], error: null };
      }
    } catch (err: any) {
      return { historicos: [], error: err.message || "Erro desconhecido" };
    }
  };

  /**
   * Mescla dados dos colaboradores com dados do histórico
   */
  const mesclarColaboradoresComHistorico = (
    colaboradores: any[],
    historicos: any[]
  ) => {
    // Se não há históricos, retornar colaboradores como estão
    if (!historicos || historicos.length === 0) {
      return colaboradores;
    }

    // Criar um mapa de históricos por colaborador_id
    const historicoMap = new Map();
    historicos.forEach((h) => {
      const id = h.colaborador_id || h.id;
      historicoMap.set(id, h);
    });

    // Mesclar dados
    return colaboradores.map((colab) => {
      const historico = historicoMap.get(colab.id);

      if (historico) {
        // Retornar dados do histórico (têm os campos ent1-ent5, sai1-sai5)
        return {
          ...colab,
          ...historico,
          id: colab.id, // Manter o ID original
        };
      }

      return colab;
    });
  };

  /**
   * Salva histórico completo para uma data específica
   */
  const salvarHistorico = async (
    colaboradorId: number,
    data: string,
    dados: any
  ) => {
    try {
      logger.info(
        `💾 Salvando histórico - Colaborador: ${colaboradorId}, Data: ${data}`
      );
      logger.debug("📝 Dados a salvar:", dados);

      const supabaseAny: any = useSupabaseClient();

      // Verificar se já existe registro para este colaborador nesta data
      const { data: existente, error: fetchError } = await supabaseAny
        .from("colaboradores_historico")
        .select("*")
        .eq("colaborador_id", colaboradorId)
        .eq("data_registro", data)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        logger.error("❌ Erro ao buscar registro:", fetchError);

        // Se a tabela não existe, retornar erro específico
        if (isTableNotFoundError(fetchError)) {
          return {
            success: false,
            error:
              "Tabela colaboradores_historico não existe. Execute o script de criação da tabela.",
          };
        }

        return { success: false, error: fetchError.message };
      }

      if (existente) {
        // Atualizar registro existente
        logger.info("📝 Atualizando histórico existente ID:", existente.id);

        const { error: updateError } = await supabaseAny
          .from("colaboradores_historico")
          .update({
            ...dados,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existente.id);

        if (updateError) {
          logger.error("❌ Erro ao atualizar histórico:", updateError);
          return { success: false, error: updateError.message };
        }

        logger.success("Histórico atualizado com sucesso");
        return { success: true };
      } else {
        // Criar novo registro
        logger.info("➕ Criando novo histórico");

        const { error: insertError } = await supabaseAny
          .from("colaboradores_historico")
          .insert({
            colaborador_id: colaboradorId,
            data_registro: data,
            ...dados,
          });

        if (insertError) {
          logger.error("❌ Erro ao criar histórico:", insertError);
          return { success: false, error: insertError.message };
        }

        logger.success("Histórico criado com sucesso");
        return { success: true };
      }
    } catch (err: any) {
      logger.error("❌ Erro ao salvar histórico:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    loading,
    error,
    registrarMovimentacao,
    buscarMovimentacoesDia,
    buscarResumoColaboradoresDia,
    limparRegistrosDiaAtual,
    // Adicionar novas funções para compatibilidade com novaEntrada.vue
    buscarHistoricoPorData,
    buscarHistoricosPorData,
    mesclarColaboradoresComHistorico,
    salvarHistorico,
  };
};
