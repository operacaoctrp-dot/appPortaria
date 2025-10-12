<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Teste de Conexão Supabase</h1>

    <div class="space-y-4">
      <BaseButton @click="testarConexaoBasica" :loading="loading">
        Testar Conexão Básica
      </BaseButton>

      <BaseButton @click="listarTabelas" :loading="loading">
        Verificar Permissões
      </BaseButton>

      <BaseButton @click="verificarColaboradores" :loading="loading">
        Verificar Colaboradores
      </BaseButton>

      <BaseButton @click="criarColaboradorTeste" :loading="loading">
        Criar Colaborador de Teste
      </BaseButton>
    </div>

    <div v-if="resultado" class="mt-6 p-4 bg-gray-100 rounded">
      <h3 class="font-bold">Resultado:</h3>
      <pre class="text-sm mt-2 overflow-auto">{{
        JSON.stringify(resultado, null, 2)
      }}</pre>
    </div>

    <div v-if="erro" class="mt-6 p-4 bg-red-100 rounded">
      <h3 class="font-bold text-red-800">Erro:</h3>
      <pre class="text-sm mt-2 overflow-auto text-red-700">{{
        JSON.stringify(erro, null, 2)
      }}</pre>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "~/components/BaseButton.vue";

const supabase = useSupabaseClient();
const loading = ref(false);
const resultado = ref(null);
const erro = ref(null);

const testarConexaoBasica = async () => {
  loading.value = true;
  resultado.value = null;
  erro.value = null;

  try {
    console.log("🧪 Testando conexão básica...");

    // Teste mais simples possível - só verificar se o cliente Supabase funciona
    const { data, error } = await supabase
      .from("colaboradores")
      .select("count", { count: "exact", head: true });

    if (error) {
      erro.value = error;
    } else {
      resultado.value = {
        sucesso: true,
        count: data,
        message: "Conexão funcionando! Tabela colaboradores acessível.",
      };
    }
  } catch (err) {
    erro.value = err;
  } finally {
    loading.value = false;
  }
};

const listarTabelas = async () => {
  loading.value = true;
  resultado.value = null;
  erro.value = null;

  try {
    // Teste simples para verificar permissões
    console.log("🔍 Verificando permissões e estrutura...");

    const { data, error } = await supabase
      .from("colaboradores")
      .select("*")
      .limit(1);

    resultado.value = {
      tabela_acessivel: !error,
      primeiro_registro: data?.[0] || null,
      erro_acesso: error,
      message: error ? "Tabela não acessível" : "Tabela acessível",
    };

    if (error) {
      erro.value = error;
    }
  } catch (err) {
    erro.value = err;
  } finally {
    loading.value = false;
  }
};

const verificarColaboradores = async () => {
  loading.value = true;
  resultado.value = null;
  erro.value = null;

  try {
    console.log("🔍 Verificando tabela colaboradores...");

    // Primeiro, verificar se a tabela existe fazendo uma query simples
    const { data, error, count } = await supabase
      .from("colaboradores")
      .select("*", { count: "exact" })
      .limit(5);

    resultado.value = {
      data,
      error,
      count,
      total_registros: count,
    };

    if (error) {
      erro.value = error;
    }
  } catch (err) {
    erro.value = err;
  } finally {
    loading.value = false;
  }
};

const criarColaboradorTeste = async () => {
  loading.value = true;
  resultado.value = null;
  erro.value = null;

  try {
    console.log("➕ Criando colaborador de teste...");

    const novoColaborador = {
      matricula: 99999, // Número em vez de string
      nome: "João Teste",
      funcao: "Desenvolvedor",
      filial: "Matriz",
    };

    const { data, error } = await supabase
      .from("colaboradores")
      .insert([novoColaborador])
      .select();

    resultado.value = {
      data,
      error,
      message: data
        ? "Colaborador criado com sucesso!"
        : "Falha ao criar colaborador",
    };

    if (error) {
      erro.value = error;
    }
  } catch (err) {
    erro.value = err;
  } finally {
    loading.value = false;
  }
};

// Meta tags
useHead({
  title: "Teste Supabase - Sistema de Portaria",
});
</script>
