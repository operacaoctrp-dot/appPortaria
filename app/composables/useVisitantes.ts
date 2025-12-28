import { ref } from "vue";

// Usar supabaseAny para acessar tabela não tipada
const supabaseAny = useSupabaseClient() as any;

export const useVisitantes = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Buscar todos os visitantes cadastrados
   */
  const buscarVisitantes = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabaseAny
        .from("visitantes")
        .select("*")
        .order("nome", { ascending: true });

      if (fetchError) {
        console.error("❌ Erro ao buscar visitantes:", fetchError);
        throw fetchError;
      }

      return data || [];
    } catch (err) {
      error.value = (err as any)?.message || "Erro ao buscar visitantes";
      console.error("❌ Erro:", err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Criar novo visitante
   */
  const criarVisitante = async (dadosVisitante: {
    rg?: string | null;
    nome?: string | null;
    empresa?: string | null;
    autorizacao?: string | null;
    informada_portaria?: boolean | null;
  }) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: insertError } = await supabaseAny
        .from("visitantes")
        .insert([dadosVisitante])
        .select()
        .single();

      if (insertError) {
        console.error("❌ Erro ao criar visitante:", insertError);
        throw insertError;
      }

      console.log("✅ Visitante criado:", data);
      return data;
    } catch (err) {
      error.value = (err as any)?.message || "Erro ao criar visitante";
      console.error("❌ Erro:", err);
      throw err as any;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Atualizar visitante existente
   */
  const atualizarVisitante = async (
    visitanteId: string | number,
    dadosAtualizados: {
      rg?: string | null;
      nome?: string | null;
      empresa?: string | null;
      autorizacao?: string | null;
      informada_portaria?: boolean | null;
    }
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabaseAny
        .from("visitantes")
        .update(dadosAtualizados)
        .eq("id", visitanteId)
        .select()
        .single();

      if (updateError) {
        console.error("❌ Erro ao atualizar visitante:", updateError);
        throw updateError;
      }

      console.log("✅ Visitante atualizado:", data);
      return data;
    } catch (err) {
      error.value = (err as any)?.message || "Erro ao atualizar visitante";
      console.error("❌ Erro:", err);
      throw err as any;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Deletar visitante
   */
  const deletarVisitante = async (visitanteId: string | number) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabaseAny
        .from("visitantes")
        .delete()
        .eq("id", visitanteId);

      if (deleteError) {
        console.error("❌ Erro ao deletar visitante:", deleteError);
        throw deleteError;
      }

      console.log("✅ Visitante deletado");
      return true;
    } catch (err) {
      error.value = (err as any)?.message || "Erro ao deletar visitante";
      console.error("❌ Erro:", err);
      throw err as any;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    buscarVisitantes,
    criarVisitante,
    atualizarVisitante,
    deletarVisitante,
  };
};
