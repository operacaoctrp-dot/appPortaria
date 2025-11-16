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
            :type="showLoginPassword ? 'text' : 'password'"
            placeholder="Digite sua senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="current-password"
            required
            size="md"
            :disabled="loading"
            @blur="validatePassword"
            @input="clearPasswordError"
          >
            <template #suffix>
              <button
                type="button"
                @click="showLoginPassword = !showLoginPassword"
                class="focus:outline-none"
                tabindex="-1"
              >
                <EyeIcon
                  v-if="!showLoginPassword"
                  class="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                />
                <EyeSlashIcon
                  v-else
                  class="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                />
              </button>
            </template>
          </BaseInput>

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
          <button
            type="button"
            @click="goToRecuperarSenha"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 cursor-pointer hover:underline"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </div>

      <!-- Register Form -->
      <div v-else-if="activeTab === 'register'" class="space-y-6">
        <!-- Mensagem de sucesso -->
        <div
          v-if="registerSuccess"
          class="bg-success-50 border border-success-200 rounded-lg p-4"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-success-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <p class="text-sm text-success-800 font-semibold">
                Conta criada com sucesso!
              </p>
              <p class="text-sm text-success-700 mt-1">
                Enviamos um email de confirmação para você. Verifique sua caixa
                de entrada e confirme seu cadastro para fazer login.
              </p>
            </div>
          </div>
        </div>

        <!-- Mensagem de erro -->
        <div
          v-if="error && !registerSuccess"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p class="text-sm text-red-600 font-medium">{{ error }}</p>
        </div>

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
            :disabled="loading || registerSuccess"
            @blur="validateRegisterEmail"
            @input="emailError = ''"
          />

          <!-- Erro específico do e-mail -->
          <div v-if="emailError" class="text-sm text-red-600 mt-1">
            {{ emailError }}
          </div>

          <BaseInput
            v-model="registerForm.password"
            label="Senha"
            :type="showRegisterPassword ? 'text' : 'password'"
            placeholder="Crie uma senha forte"
            :prefix-icon="LockClosedIcon"
            autocomplete="new-password"
            required
            size="md"
            :disabled="loading || registerSuccess"
            @blur="validateRegisterPassword"
            @input="passwordError = ''"
          >
            <template #suffix>
              <button
                type="button"
                @click="showRegisterPassword = !showRegisterPassword"
                class="focus:outline-none"
                tabindex="-1"
              >
                <EyeIcon
                  v-if="!showRegisterPassword"
                  class="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                />
                <EyeSlashIcon
                  v-else
                  class="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                />
              </button>
            </template>
          </BaseInput>

          <!-- Erro específico da senha -->
          <div v-if="passwordError" class="text-sm text-red-600 mt-1">
            {{ passwordError }}
          </div>

          <!-- Requisitos da senha -->
          <div class="text-xs text-secondary-600 space-y-1">
            <p class="font-medium">Requisitos da senha:</p>
            <ul class="list-disc list-inside space-y-0.5 ml-2">
              <li
                :class="
                  registerForm.password.length >= 8
                    ? 'text-success-600'
                    : 'text-secondary-500'
                "
              >
                Mínimo de 8 caracteres
              </li>
              <li
                :class="
                  /[A-Z]/.test(registerForm.password)
                    ? 'text-success-600'
                    : 'text-secondary-500'
                "
              >
                Uma letra maiúscula
              </li>
              <li
                :class="
                  /[0-9]/.test(registerForm.password)
                    ? 'text-success-600'
                    : 'text-secondary-500'
                "
              >
                Um número
              </li>
            </ul>
          </div>

          <BaseInput
            v-model="registerForm.confirmPassword"
            label="Confirmar Senha"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirme sua senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="new-password"
            required
            size="md"
            :disabled="loading || registerSuccess"
            @blur="validateConfirmPassword"
            @input="confirmPasswordError = ''"
          >
            <template #suffix>
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="focus:outline-none"
                tabindex="-1"
              >
                <EyeIcon
                  v-if="!showConfirmPassword"
                  class="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                />
                <EyeSlashIcon
                  v-else
                  class="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                />
              </button>
            </template>
          </BaseInput>

          <!-- Erro específico da confirmação -->
          <div v-if="confirmPasswordError" class="text-sm text-red-600 mt-1">
            {{ confirmPasswordError }}
          </div>

          <BaseButton
            v-if="!registerSuccess"
            type="submit"
            variant="success"
            size="lg"
            :icon="UserPlusIcon"
            full-width
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? "Criando conta..." : "Criar Conta" }}
          </BaseButton>

          <BaseButton
            v-else
            @click="activeTab = 'login'"
            variant="primary"
            size="lg"
            full-width
          >
            Ir para Login
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
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";

// Importar componentes explicitamente
import BaseInput from "~/components/common/BaseInput.vue";
import BaseButton from "~/components/common/BaseButton.vue";

// Composables
const { login, register, loading } = useAuth();
const router = useRouter();

// Estado das abas
const activeTab = ref("login");

// Estado para mensagens de erro
const error = ref("");
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

// Estado de sucesso no registro
const registerSuccess = ref(false);

// Estado para mostrar/ocultar senhas
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const showConfirmPassword = ref(false);

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

// Validação da senha do login em tempo real
const validatePassword = () => {
  passwordError.value = "";

  if (!loginForm.value.password.trim()) {
    passwordError.value = "Senha é obrigatória";
    return false;
  }

  return true;
};

// Validação da senha em tempo real (para registro)
const validateRegisterPassword = () => {
  passwordError.value = "";

  if (!registerForm.value.password.trim()) {
    passwordError.value = "Senha é obrigatória";
    return false;
  }

  if (registerForm.value.password.length < 8) {
    passwordError.value = "A senha deve ter pelo menos 8 caracteres";
    return false;
  }

  // Verificar se tem letra maiúscula
  if (!/[A-Z]/.test(registerForm.value.password)) {
    passwordError.value = "A senha deve conter pelo menos uma letra maiúscula";
    return false;
  }

  // Verificar se tem número
  if (!/[0-9]/.test(registerForm.value.password)) {
    passwordError.value = "A senha deve conter pelo menos um número";
    return false;
  }

  return true;
};

// Validação de confirmação de senha
const validateConfirmPassword = () => {
  confirmPasswordError.value = "";

  if (!registerForm.value.confirmPassword.trim()) {
    confirmPasswordError.value = "Confirmação de senha é obrigatória";
    return false;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    confirmPasswordError.value = "As senhas não coincidem";
    return false;
  }

  return true;
};

// Validação de email para registro
const validateRegisterEmail = () => {
  emailError.value = "";

  if (!registerForm.value.email.trim()) {
    emailError.value = "E-mail é obrigatório";
    return false;
  }

  if (!isValidEmail(registerForm.value.email)) {
    emailError.value = "Digite um e-mail válido (exemplo: usuario@email.com)";
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

// Estado para evitar múltiplos cliques
const isNavigating = ref(false);

// Função para navegar para recuperação de senha
const goToRecuperarSenha = () => {
  if (isNavigating.value) {
    console.log("⚠️ Navegação já em andamento, ignorando clique");
    return;
  }
  
  isNavigating.value = true;
  console.log("🔑 Navegando para /recuperar-senha usando window.location");
  
  // Usar navegação nativa diretamente
  window.location.href = "/recuperar-senha";
  
  setTimeout(() => {
    isNavigating.value = false;
  }, 1000);
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
      console.error("🔴 Erro de login:", loginError.message);
      
      // Verificar se é erro de configuração do Supabase
      if (loginError.message?.includes("Invalid API key") || 
          loginError.message?.includes("JWT") ||
          loginError.message?.includes("fetch")) {
        error.value = "⚠️ Erro de configuração do Supabase. Verifique as credenciais no arquivo .env";
        return;
      }
      
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
          error.value = `Erro ao fazer login: ${loginError.message}`;
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
    console.error("🔴 Erro crítico no login:", err);
    const errorMessage = err && typeof err === 'object' && 'message' in err ? err.message : "Erro inesperado no servidor. Tente novamente em alguns instantes";
    error.value = errorMessage;
  }
};

const handleRegister = async () => {
  try {
    // Limpar erros anteriores
    error.value = "";
    emailError.value = "";
    passwordError.value = "";
    confirmPasswordError.value = "";
    registerSuccess.value = false;

    // Validar campos
    const isEmailValid = validateRegisterEmail();
    const isPasswordValid = validateRegisterPassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    // Se houver erros de validação, não prosseguir
    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    // Tentar fazer registro
    const { error: registerError, data } = await register(
      registerForm.value.email.trim(),
      registerForm.value.password
    );

    if (registerError) {
      // Traduzir erros comuns do Supabase
      switch (registerError.message) {
        case "User already registered":
          error.value = "Este e-mail já está cadastrado. Tente fazer login.";
          break;
        case "Password should be at least 6 characters":
          error.value = "A senha deve ter pelo menos 6 caracteres";
          break;
        case "Signup requires a valid password":
          error.value = "Digite uma senha válida";
          break;
        default:
          error.value = "Erro ao criar conta. Tente novamente.";
          console.error("Erro detalhado:", registerError);
      }
    } else {
      // Registro bem-sucedido
      registerSuccess.value = true;
      error.value = "";
      
      // Limpar formulário
      registerForm.value = {
        email: "",
        password: "",
        confirmPassword: "",
      };
    }
  } catch (err) {
    console.error("Erro no registro:", err);
    error.value = "Erro inesperado no servidor. Tente novamente em alguns instantes";
  }
};
</script>
