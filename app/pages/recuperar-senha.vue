<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
    <div class="w-full max-w-md">
      <!-- Card Principal -->
      <div class="bg-white rounded-2xl shadow-card p-8">
        <!-- Ícone e Título -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <KeyIcon class="h-8 w-8 text-primary-600" />
          </div>
          <h1 class="text-2xl font-bold text-secondary-900 mb-2">
            Recuperar Senha
          </h1>
          <p class="text-sm text-secondary-600">
            Digite seu e-mail para receber instruções de recuperação
          </p>
        </div>

        <!-- Mensagem de Sucesso -->
        <div
          v-if="success"
          class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg"
        >
          <div class="flex items-start">
            <CheckCircleIcon class="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p class="text-sm font-medium text-green-800">
                E-mail enviado com sucesso!
              </p>
              <p class="text-sm text-green-700 mt-1">
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
            </div>
          </div>
        </div>

        <!-- Mensagem de Erro -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
        >
          <div class="flex items-start">
            <ExclamationCircleIcon class="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>

        <!-- Formulário -->
        <form v-if="!success" @submit.prevent="handleResetPassword" class="space-y-6">
          <!-- Campo de E-mail -->
          <BaseInput
            v-model="email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail cadastrado"
            :prefix-icon="EnvelopeIcon"
            autocomplete="email"
            required
            size="md"
            :disabled="loading"
            @blur="validateEmail"
            @input="emailError = ''"
          />
          
          <!-- Erro de validação do email -->
          <p v-if="emailError" class="text-sm text-red-600 -mt-4">
            {{ emailError }}
          </p>

          <!-- Botão Enviar -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            :disabled="loading || !email"
            full-width
          >
            <template #icon>
              <PaperAirplaneIcon class="h-5 w-5" />
            </template>
            {{ loading ? "Enviando..." : "Enviar E-mail de Recuperação" }}
          </BaseButton>

          <!-- Link para voltar ao login -->
          <div class="text-center">
            <NuxtLink
              to="/login"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              ← Voltar para o login
            </NuxtLink>
          </div>
        </form>

        <!-- Ação após sucesso -->
        <div v-else class="space-y-4">
          <BaseButton
            variant="secondary"
            size="lg"
            full-width
            @click="navigateTo('/login')"
          >
            Voltar para o Login
          </BaseButton>
          
          <button
            @click="resetForm"
            class="w-full text-sm text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            Não recebeu o e-mail? Tentar novamente
          </button>
        </div>
      </div>

      <!-- Informação adicional -->
      <div class="mt-6 text-center">
        <p class="text-sm text-secondary-600">
          O e-mail pode levar alguns minutos para chegar. Verifique também sua caixa de spam.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  KeyIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/outline";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";

// Meta tags
definePageMeta({
  layout: false,
  // Sem middleware - permite acesso mesmo logado (caso usuário queira trocar senha)
});

// Estados
const email = ref("");
const emailError = ref("");
const error = ref("");
const success = ref(false);
const loading = ref(false);

// Composables
const { resetPassword } = useAuth();

// Validação de e-mail
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateEmail = () => {
  emailError.value = "";

  if (!email.value.trim()) {
    emailError.value = "E-mail é obrigatório";
    return false;
  }

  if (!isValidEmail(email.value)) {
    emailError.value = "Digite um e-mail válido (exemplo: usuario@email.com)";
    return false;
  }

  return true;
};

// Função para solicitar recuperação de senha
const handleResetPassword = async () => {
  try {
    // Limpar mensagens anteriores
    error.value = "";
    success.value = false;

    // Validar email
    if (!validateEmail()) {
      return;
    }

    // Solicitar recuperação
    const { error: resetError } = await resetPassword(email.value.trim());

    if (resetError) {
      // Traduzir erros comuns
      switch (resetError.message) {
        case "User not found":
          error.value = "E-mail não cadastrado no sistema";
          break;
        case "Email not confirmed":
          error.value = "E-mail não confirmado. Verifique sua caixa de entrada primeiro";
          break;
        default:
          error.value = `Erro ao enviar e-mail: ${resetError.message}`;
          console.error("Erro detalhado:", resetError);
      }
    } else {
      // Sucesso
      success.value = true;
    }
  } catch (err) {
    console.error("🔴 Erro crítico na recuperação:", err);
    const errorMessage = err && typeof err === 'object' && 'message' in err ? String(err.message) : "Erro inesperado. Tente novamente em alguns instantes";
    error.value = errorMessage;
  }
};

// Resetar formulário para tentar novamente
const resetForm = () => {
  email.value = "";
  emailError.value = "";
  error.value = "";
  success.value = false;
};
</script>
