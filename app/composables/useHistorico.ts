import type { Colaborador } from "~/types/colaborador";

/**
 * Interface para histórico de colaborador
 */
export interface ColaboradorHistorico {
  id: number;
  colaborador_id: number;
  data_registro: string; // YYYY-MM-DD
  nome: string | null;
  funcao: string | null;
  filial: string | null;
  matricula: string | null;
  ent1: string | null;
  sai1: string | null;
  ent2: string | null;
  sai2: string | null;
  ent3: string | null;
  sai3: string | null;
  ent4: string | null;
  sai4: string | null;
  ent5: string | null;
  sai5: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Composable para gerenciar histórico de entrada/saída
 */
export const useHistorico = () => {
  const supabase = useSupabaseClient();
  const supabaseAny: any = useSupabaseClient(); // Para tabelas não tipadas (sem validação de tipos)

  /**
   * Buscar histórico de um colaborador em uma data específica
   */
  const buscarHistoricoPorData = async (
    colaboradorId: number,
    data: string, // formato: 'YYYY-MM-DD'
    origem: string = "principal" // 'principal' ou 'sfl'
  ) => {
    try {
      console.log(
        `🔍 Buscando histórico - Colaborador: ${colaboradorId}, Data: ${data}, Origem: ${origem}`
      );

      const { data: historico, error } = await supabaseAny
        .from("colaboradores_historico")
        .select("*")
        .eq("colaborador_id", colaboradorId)
        .eq("data_registro", data)
        .eq("origem", origem)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = nenhum resultado encontrado (não é erro)
        console.error("❌ Erro ao buscar histórico:", error);
        throw error;
      }

      if (historico) {
        console.log("✅ Histórico encontrado:", historico);
      } else {
        console.log("⚪ Nenhum histórico encontrado para esta data");
      }

      return { historico, error: null };
    } catch (err) {
      console.error("❌ Erro no buscarHistoricoPorData:", err);
      return { historico: null, error: err };
    }
  };

  /**
   * Salvar ou atualizar histórico de um dia
   */
  const salvarHistorico = async (
    colaboradorId: number,
    data: string, // formato: 'YYYY-MM-DD'
    dados: {
      nome?: string;
      funcao?: string;
      filial?: string;
      matricula?: string | number;
      ent1?: string | null;
      sai1?: string | null;
      ent2?: string | null;
      sai2?: string | null;
      ent3?: string | null;
      sai3?: string | null;
      ent4?: string | null;
      sai4?: string | null;
      ent5?: string | null;
      sai5?: string | null;
    },
    origem: string = "principal" // 'principal' ou 'sfl'
  ) => {
    try {
      console.log(
        "💾 Salvando histórico - Colaborador:",
        colaboradorId,
        "Data:",
        data,
        "Origem:",
        origem
      );

      // Buscar se já existe registro
      const { historico } = await buscarHistoricoPorData(
        colaboradorId,
        data,
        origem
      );

      // Preparar dados (garantir que matricula seja string)
      const dadosParaSalvar = {
        ...dados,
        matricula: dados.matricula?.toString() || null,
      };

      if (historico) {
        // Atualizar existente
        console.log("📝 Atualizando histórico existente...");
        const { data: updated, error } = await supabaseAny
          .from("colaboradores_historico")
          .update({
            ...dadosParaSalvar,
            updated_at: new Date().toISOString(),
          })
          .eq("id", historico.id)
          .select();

        if (error) {
          console.error("❌ Erro ao atualizar histórico:", error);
          console.error("❌ Detalhes:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          throw error;
        }

        console.log("✅ Histórico atualizado com sucesso:", updated);
        return { data: updated, error: null };
      } else {
        // Criar novo
        console.log("➕ Criando novo histórico...");
        const { data: created, error } = await supabaseAny
          .from("colaboradores_historico")
          .insert([
            {
              colaborador_id: colaboradorId,
              data_registro: data,
              origem: origem,
              ...dadosParaSalvar,
            },
          ])
          .select();

        if (error) {
          console.error("❌ Erro ao criar histórico:", error);
          console.error("❌ Detalhes:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          throw error;
        }

        console.log("✅ Histórico criado com sucesso:", created);
        return { data: created, error: null };
      }
    } catch (err) {
      console.error("❌ Erro no salvarHistorico:", err);
      console.error("❌ Tipo do erro:", typeof err);
      console.error("❌ Erro completo:", JSON.stringify(err, null, 2));
      return { data: null, error: err };
    }
  };

  /**
   * Buscar históricos de todos os colaboradores em uma data
   */
  const buscarHistoricosPorData = async (
    data: string,
    origem: string = "principal"
  ) => {
    try {
      console.log(
        `🔍 Buscando todos os históricos para data: ${data}, origem: ${origem}`
      );

      const { data: historicos, error } = await supabaseAny
        .from("colaboradores_historico")
        .select("*")
        .eq("data_registro", data)
        .eq("origem", origem)
        .order("nome", { ascending: true });

      if (error) {
        console.error("❌ Erro ao buscar históricos:", error);
        throw error;
      }

      console.log(`✅ ${historicos?.length || 0} históricos encontrados`);
      return { historicos, error: null };
    } catch (err) {
      console.error("❌ Erro no buscarHistoricosPorData:", err);
      return { historicos: null, error: err };
    }
  };

  /**
   * Buscar histórico de um período
   */
  const buscarHistoricoPeriodo = async (
    dataInicio: string,
    dataFim: string,
    colaboradorId?: number
  ) => {
    try {
      console.log(
        `🔍 Buscando histórico - Período: ${dataInicio} a ${dataFim}${
          colaboradorId ? `, Colaborador: ${colaboradorId}` : ""
        }`
      );

      let query = supabaseAny
        .from("colaboradores_historico")
        .select("*")
        .gte("data_registro", dataInicio)
        .lte("data_registro", dataFim);

      if (colaboradorId) {
        query = query.eq("colaborador_id", colaboradorId);
      }

      const { data: historicos, error } = await query
        .order("data_registro", { ascending: false })
        .order("nome", { ascending: true });

      if (error) {
        console.error("❌ Erro ao buscar histórico do período:", error);
        throw error;
      }

      console.log(
        `✅ ${historicos?.length || 0} históricos encontrados no período`
      );
      return { historicos, error: null };
    } catch (err) {
      console.error("❌ Erro no buscarHistoricoPeriodo:", err);
      return { historicos: null, error: err };
    }
  };

  /**
   * Deletar histórico de uma data específica
   */
  const deletarHistorico = async (colaboradorId: number, data: string) => {
    try {
      console.log(
        `🗑️ Deletando histórico - Colaborador: ${colaboradorId}, Data: ${data}`
      );

      const { error } = await supabaseAny
        .from("colaboradores_historico")
        .delete()
        .eq("colaborador_id", colaboradorId)
        .eq("data_registro", data);

      if (error) {
        console.error("❌ Erro ao deletar histórico:", error);
        throw error;
      }

      console.log("✅ Histórico deletado com sucesso");
      return { success: true, error: null };
    } catch (err) {
      console.error("❌ Erro no deletarHistorico:", err);
      return { success: false, error: err };
    }
  };

  /**
   * Mesclar dados de colaboradores com histórico de uma data
   */
  const mesclarColaboradoresComHistorico = (
    colaboradores: Colaborador[],
    historicos: ColaboradorHistorico[] | null
  ): Colaborador[] => {
    if (!historicos || historicos.length === 0) {
      // Se não há históricos, retornar colaboradores com campos vazios
      return colaboradores.map((colab) => ({
        ...colab,
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
      }));
    }

    // Mesclar dados
    return colaboradores.map((colab) => {
      const hist = historicos.find((h) => h.colaborador_id === colab.id);

      if (hist) {
        // Se tem histórico, usar dados do histórico
        return {
          ...colab,
          ent1: hist.ent1,
          sai1: hist.sai1,
          ent2: hist.ent2,
          sai2: hist.sai2,
          ent3: hist.ent3,
          sai3: hist.sai3,
          ent4: hist.ent4,
          sai4: hist.sai4,
          ent5: hist.ent5,
          sai5: hist.sai5,
        };
      }

      // Se não tem histórico, retornar com campos vazios
      return {
        ...colab,
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
      };
    });
  };

  return {
    buscarHistoricoPorData,
    salvarHistorico,
    buscarHistoricosPorData,
    buscarHistoricoPeriodo,
    deletarHistorico,
    mesclarColaboradoresComHistorico,
  };
};
