<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Card Container -->
    <div
      class="bg-white rounded-2xl shadow-strong p-8 border border-neutral-100"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center space-x-3 mb-4">
          <UserCircleIcon class="h-10 w-10 text-primary-500" />
          <h2 class="text-3xl font-bold text-secondary-800">
            Acesso ao Sistema
          </h2>
        </div>
        <p class="text-secondary-600">
          Entre ou crie sua conta para acessar o sistema
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex mb-6 bg-neutral-100 rounded-xl p-1">
        <button
          @click="activeTab = 'login'"
          :class="[
            'flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200',
            activeTab === 'login'
              ? 'bg-white text-primary-600 shadow-soft'
              : 'text-secondary-600 hover:text-secondary-800',
          ]"
        >
          Entrar
        </button>
        <button
          @click="activeTab = 'register'"
          :class="[
            'flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200',
            activeTab === 'register'
              ? 'bg-white text-primary-600 shadow-soft'
              : 'text-secondary-600 hover:text-secondary-800',
          ]"
        >
          Criar Conta
        </button>
      </div>

      <!-- Login Form -->
      <div v-if="activeTab === 'login'" class="space-y-6">
        <!-- Mensagem de erro -->
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p class="text-sm text-red-600 font-medium">{{ error }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <BaseInput
            v-model="loginForm.email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            :prefix-icon="EnvelopeIcon"
            autocomplete="email"
            required
            size="md"
            :disabled="loading"
            @blur="validateEmail"
            @input="clearEmailError"
          />

          <!-- Erro específico do e-mail -->
          <div v-if="emailError" class="text-sm text-red-600 mt-1">
            {{ emailError }}
          </div>

          <BaseInput
            v-model="loginForm.password"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="current-password"
            required
            size="md"
            :disabled="loading"
            @blur="validatePassword"
            @input="clearPasswordError"
          />

          <!-- Erro específico da senha -->
          <div v-if="passwordError" class="text-sm text-red-600 mt-1">
            {{ passwordError }}
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :icon="ArrowRightOnRectangleIcon"
            full-width
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? "Entrando..." : "Entrar no Sistema" }}
          </BaseButton>
        </form>

        <!-- Forgot Password Link -->
        <div class="text-center">
          <a
            href="#"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            Esqueceu sua senha?
          </a>
        </div>
      </div>

      <!-- Register Form -->
      <div v-else-if="activeTab === 'register'" class="space-y-6">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <BaseInput
            v-model="registerForm.email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            :prefix-icon="EnvelopeIcon"
            autocomplete="email"
            required
            size="md"
          />

          <BaseInput
            v-model="registerForm.password"
            label="Senha"
            type="password"
            placeholder="Crie uma senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="new-password"
            required
            size="md"
          />

          <BaseInput
            v-model="registerForm.confirmPassword"
            label="Confirmar Senha"
            type="password"
            placeholder="Confirme sua senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="new-password"
            required
            size="md"
          />

          <BaseButton
            type="submit"
            variant="success"
            size="lg"
            :icon="UserPlusIcon"
            full-width
          >
            Criar Conta
          </BaseButton>
        </form>
      </div>
    </div>

    <!-- Additional Info -->
    <div class="mt-6 text-center">
      <p class="text-sm text-secondary-500">
        Sistema seguro de controle de portaria
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/vue/24/outline";

// Imports explícitos dos componentes
import BaseInput from "~/components/BaseInput.vue";
import BaseButton from "~/components/BaseButton.vue";

// Composable de autenticação
const { login, loading } = useAuth();

// Estado das abas
const activeTab = ref("login");

// Estado para mensagens de erro
const error = ref("");
const emailError = ref("");
const passwordError = ref("");

// Formulário de login
const loginForm = ref({
  email: "",
  password: "",
});

// Formulário de registro
const registerForm = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

// Função para validar e-mail
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação do e-mail em tempo real
const validateEmail = () => {
  emailError.value = "";

  if (!loginForm.value.email.trim()) {
    emailError.value = "E-mail é obrigatório";
    return false;
  }

  if (!isValidEmail(loginForm.value.email)) {
    emailError.value = "Digite um e-mail válido (exemplo: usuario@email.com)";
    return false;
  }

  return true;
};

// Validação da senha em tempo real
const validatePassword = () => {
  passwordError.value = "";

  if (!loginForm.value.password.trim()) {
    passwordError.value = "Senha é obrigatória";
    return false;
  }

  if (loginForm.value.password.length < 6) {
    passwordError.value = "A senha deve ter pelo menos 6 caracteres";
    return false;
  }

  return true;
};

// Funções para limpar erros quando o usuário digita
const clearEmailError = () => {
  emailError.value = "";
  error.value = ""; // Limpar erro geral também
};

const clearPasswordError = () => {
  passwordError.value = "";
  error.value = ""; // Limpar erro geral também
};

// Função de login com validações
const handleLogin = async () => {
  try {
    // Limpar erros anteriores
    error.value = "";
    emailError.value = "";
    passwordError.value = "";

    // Validar campos
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    // Se houver erros de validação, não prosseguir
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Tentar fazer login
    const { error: loginError } = await login(
      loginForm.value.email.trim(),
      loginForm.value.password
    );

    if (loginError) {
      // Traduzir erros comuns do Supabase
      switch (loginError.message) {
        case "Invalid login credentials":
          error.value =
            "E-mail ou senha incorretos. Verifique seus dados e tente novamente";
          break;
        case "Email not confirmed":
          error.value =
            "E-mail não confirmado. Verifique sua caixa de entrada e confirme seu cadastro";
          break;
        case "Too many requests":
          error.value =
            "Muitas tentativas de login. Aguarde alguns minutos e tente novamente";
          break;
        case "User not found":
          error.value = "Usuário não encontrado. Verifique o e-mail digitado";
          break;
        case "Invalid password":
          error.value = "Senha incorreta. Tente novamente";
          break;
        case "signInWithPassword":
          error.value = "Erro de autenticação. Verifique suas credenciais";
          break;
        default:
          error.value = "Erro ao fazer login. Tente novamente";
          console.error("Erro detalhado:", loginError);
      }
    } else {
      // Login bem-sucedido - limpar formulário
      loginForm.value.email = "";
      loginForm.value.password = "";
      error.value = "";
      emailError.value = "";
      passwordError.value = "";

      // Redirecionar para a página principal
      await navigateTo("/");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    error.value =
      "Erro inesperado no servidor. Tente novamente em alguns instantes";
  }
};

const handleRegister = () => {
  // Função de registro será implementada posteriormente
  console.log("Register form submitted:", registerForm.value);
};
</script>
