<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4"
  >
    <div class="w-full max-w-md">
      <!-- Card Principal -->
      <div class="bg-white rounded-2xl shadow-card p-8">
        <!-- Ícone e Título -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4"
          >
            <LockClosedIcon class="h-8 w-8 text-primary-600" />
          </div>
          <h1 class="text-2xl font-bold text-secondary-900 mb-2">
            Redefinir Senha
          </h1>
          <p class="text-sm text-secondary-600">
            Digite sua nova senha para acessar o sistema
          </p>
        </div>

        <!-- Mensagem de Sucesso -->
        <div
          v-if="success"
          class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg"
        >
          <div class="flex items-start">
            <CheckCircleIcon
              class="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
            />
            <div>
              <p class="text-sm font-medium text-green-800">
                Senha atualizada com sucesso!
              </p>
              <p class="text-sm text-green-700 mt-1">
                Você será redirecionado para o login em
                {{ countdown }} segundos...
              </p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="checkingToken" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"
          ></div>
          <p class="text-sm text-secondary-600">
            Verificando token de recuperação...
          </p>
        </div>

        <!-- Mensagem de Erro -->
        <div
          v-if="error && !checkingToken"
          class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
        >
          <div class="flex items-start">
            <ExclamationCircleIcon
              class="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
            />
            <div>
              <p class="text-sm text-red-800 font-medium">{{ error }}</p>
              <p v-if="!hasValidToken" class="text-sm text-red-700 mt-2">
                Para redefinir sua senha, acesse a página de login e clique em
                "Esqueceu sua senha?".
              </p>
            </div>
          </div>
        </div>

        <!-- Formulário -->
        <form
          v-if="!success && !checkingToken && hasValidToken"
          @submit.prevent="handleUpdatePassword"
          class="space-y-6"
        >
          <!-- Campo Nova Senha -->
          <BaseInput
            v-model="newPassword"
            label="Nova Senha"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Digite sua nova senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="new-password"
            required
            size="md"
            :disabled="loading"
            @blur="validatePassword"
            @input="passwordError = ''"
          >
            <template #suffix>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="focus:outline-none"
                tabindex="-1"
              >
                <EyeIcon
                  v-if="!showPassword"
                  class="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                />
                <EyeSlashIcon
                  v-else
                  class="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                />
              </button>
            </template>
          </BaseInput>

          <!-- Erro de validação -->
          <p v-if="passwordError" class="text-sm text-red-600 -mt-4">
            {{ passwordError }}
          </p>

          <!-- Requisitos da senha -->
          <div class="space-y-2 -mt-2">
            <p class="text-xs font-medium text-secondary-700">
              Requisitos da senha:
            </p>
            <div class="space-y-1">
              <div
                class="flex items-center text-xs"
                :class="hasMinLength ? 'text-green-600' : 'text-secondary-500'"
              >
                <CheckCircleIcon v-if="hasMinLength" class="h-4 w-4 mr-2" />
                <div
                  v-else
                  class="h-4 w-4 mr-2 rounded-full border-2 border-secondary-300"
                ></div>
                Mínimo de 8 caracteres
              </div>
              <div
                class="flex items-center text-xs"
                :class="hasUpperCase ? 'text-green-600' : 'text-secondary-500'"
              >
                <CheckCircleIcon v-if="hasUpperCase" class="h-4 w-4 mr-2" />
                <div
                  v-else
                  class="h-4 w-4 mr-2 rounded-full border-2 border-secondary-300"
                ></div>
                Pelo menos uma letra maiúscula
              </div>
              <div
                class="flex items-center text-xs"
                :class="hasNumber ? 'text-green-600' : 'text-secondary-500'"
              >
                <CheckCircleIcon v-if="hasNumber" class="h-4 w-4 mr-2" />
                <div
                  v-else
                  class="h-4 w-4 mr-2 rounded-full border-2 border-secondary-300"
                ></div>
                Pelo menos um número
              </div>
            </div>
          </div>

          <!-- Campo Confirmar Senha -->
          <BaseInput
            v-model="confirmPassword"
            label="Confirmar Nova Senha"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Digite novamente sua nova senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="new-password"
            required
            size="md"
            :disabled="loading"
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

          <!-- Erro de validação confirmação -->
          <p v-if="confirmPasswordError" class="text-sm text-red-600 -mt-4">
            {{ confirmPasswordError }}
          </p>

          <!-- Botão Redefinir -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            :disabled="loading || !isFormValid"
            full-width
          >
            <template #icon>
              <CheckCircleIcon class="h-5 w-5" />
            </template>
            {{ loading ? "Atualizando..." : "Redefinir Senha" }}
          </BaseButton>

          <!-- Link para voltar ao login -->
          <div class="text-center">
            <button
              type="button"
              @click="voltarParaLogin"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              ← Voltar para o login
            </button>
          </div>
        </form>

        <!-- Botão após sucesso -->
        <div v-else-if="success">
          <BaseButton
            variant="primary"
            size="lg"
            full-width
            @click="voltarParaLogin"
          >
            <template #icon>
              <ArrowRightOnRectangleIcon class="h-5 w-5" />
            </template>
            Ir para o Login
          </BaseButton>
        </div>

        <!-- Botão quando não há token válido -->
        <div v-else-if="!checkingToken && !hasValidToken">
          <BaseButton
            variant="secondary"
            size="lg"
            full-width
            @click="voltarParaLogin"
          >
            Voltar para o Login
          </BaseButton>
        </div>
      </div>

      <!-- Informação adicional -->
      <div v-if="hasValidToken || success" class="mt-6 text-center">
        <p class="text-sm text-secondary-600">
          Após redefinir, você poderá fazer login com sua nova senha.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";

// Meta tags
definePageMeta({
  layout: false,
  // Sem middleware - precisa permitir acesso com token de recuperação
  // O Supabase cria uma sessão temporária ao processar o token
});

// Estados
const newPassword = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const error = ref("");
const success = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const countdown = ref(3);
const hasValidToken = ref(false);
const checkingToken = ref(true);

// Composables
const { updatePassword } = useAuth();
const supabase = useSupabaseClient();
const route = useRoute();

// Validações computadas
const hasMinLength = computed(() => newPassword.value.length >= 8);
const hasUpperCase = computed(() => /[A-Z]/.test(newPassword.value));
const hasNumber = computed(() => /[0-9]/.test(newPassword.value));
const isPasswordValid = computed(
  () => hasMinLength.value && hasUpperCase.value && hasNumber.value
);
const isFormValid = computed(
  () =>
    newPassword.value &&
    confirmPassword.value &&
    isPasswordValid.value &&
    newPassword.value === confirmPassword.value
);

// Validação da senha
const validatePassword = () => {
  passwordError.value = "";

  if (!newPassword.value.trim()) {
    passwordError.value = "Senha é obrigatória";
    return false;
  }

  if (newPassword.value.length < 8) {
    passwordError.value = "A senha deve ter pelo menos 8 caracteres";
    return false;
  }

  if (!hasUpperCase.value) {
    passwordError.value = "A senha deve conter pelo menos uma letra maiúscula";
    return false;
  }

  if (!hasNumber.value) {
    passwordError.value = "A senha deve conter pelo menos um número";
    return false;
  }

  return true;
};

// Validação de confirmação
const validateConfirmPassword = () => {
  confirmPasswordError.value = "";

  if (!confirmPassword.value.trim()) {
    confirmPasswordError.value = "Confirmação de senha é obrigatória";
    return false;
  }

  if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = "As senhas não coincidem";
    return false;
  }

  return true;
};

// Função para atualizar senha
const handleUpdatePassword = async () => {
  try {
    // Limpar mensagens anteriores
    error.value = "";
    success.value = false;

    // Validar campos
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    // Atualizar senha
    const { error: updateError } = await updatePassword(newPassword.value);

    if (updateError) {
      // Traduzir erros comuns
      switch (updateError.message) {
        case "New password should be different from the old password":
          error.value = "A nova senha deve ser diferente da senha atual";
          break;
        case "Password should be at least 6 characters":
          error.value = "A senha deve ter pelo menos 6 caracteres";
          break;
        default:
          error.value = `Erro ao redefinir senha: ${updateError.message}`;
          console.error("Erro detalhado:", updateError);
      }
    } else {
      // Sucesso
      success.value = true;

      // Fazer logout antes de redirecionar
      console.log("✅ Senha redefinida com sucesso - fazendo logout...");
      await supabase.auth.signOut();

      // Countdown e redirecionamento
      const interval = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          clearInterval(interval);
          window.location.href = "/login";
        }
      }, 1000);
    }
  } catch (err) {
    console.error("🔴 Erro crítico ao redefinir senha:", err);
    const errorMessage =
      err && typeof err === "object" && "message" in err
        ? String(err.message)
        : "Erro inesperado. Tente novamente em alguns instantes";
    error.value = errorMessage;
  }
};

// Verificar se há token na URL ao montar
onMounted(async () => {
  console.log("📍 Página de redefinição de senha carregada");
  console.log("🔗 URL completa:", window.location.href);

  // Verificar se há um hash na URL (onde o Supabase coloca o token após redirect)
  const hash = window.location.hash;
  console.log("🔍 Hash completo na URL:", hash || "[VAZIO]");

  // Aguardar o Supabase processar o token da URL
  // Importante: O Supabase redireciona de /auth/v1/verify para nossa página
  // e adiciona o hash automaticamente
  console.log("⏳ Aguardando processamento do token...");
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Verificar a sessão atual do Supabase
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log("🔍 Resultado da verificação de sessão:", {
      hasSession: !!session,
      sessionError: sessionError?.message,
      sessionType: session?.user ? "user encontrado" : "sem user",
      hashPresente: !!hash && hash.length > 0,
    });

    if (sessionError) {
      console.error("❌ Erro ao obter sessão:", sessionError);
      error.value =
        "Erro ao validar token de recuperação. Tente solicitar um novo link.";
      hasValidToken.value = false;
    } else if (session && session.user) {
      console.log(
        "✅ Token válido - sessão detectada para usuário:",
        session.user.email
      );
      hasValidToken.value = true;
      error.value = ""; // Limpar erro se houver
    } else {
      console.log("⚠️ Sessão não encontrada na primeira tentativa");
      console.log("🔄 Tentando novamente após 2 segundos...");

      // Tentar novamente após um delay maior
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const {
        data: { session: retrySession },
      } = await supabase.auth.getSession();

      if (retrySession && retrySession.user) {
        console.log("✅ Token válido na segunda tentativa!");
        hasValidToken.value = true;
        error.value = "";
      } else {
        console.log("❌ Token inválido mesmo após retry");
        error.value =
          "Link de recuperação inválido ou expirado. Por favor, solicite um novo link.";
        hasValidToken.value = false;
      }
    }
  } catch (err) {
    console.error("❌ Erro ao verificar sessão:", err);
    error.value = "Erro ao verificar token de recuperação.";
    hasValidToken.value = false;
  } finally {
    checkingToken.value = false;
  }
});

// Função para voltar ao login com logout
const voltarParaLogin = async () => {
  try {
    console.log("🚪 Fazendo logout da sessão temporária...");
    await supabase.auth.signOut();
    console.log("✅ Logout realizado");

    // Redirecionar para login
    window.location.href = "/login";
  } catch (err) {
    console.error("❌ Erro ao fazer logout:", err);
    // Mesmo com erro, redireciona
    window.location.href = "/login";
  }
};
</script>
