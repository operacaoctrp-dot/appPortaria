<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
    <!-- Background Decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl"></div>
    </div>

    <!-- Confirmation Card -->
    <div class="relative z-10 w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-strong p-8 border border-neutral-100">
        <!-- Loading State -->
        <div v-if="loading" class="text-center">
          <div class="flex justify-center mb-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <h2 class="text-xl font-semibold text-secondary-800 mb-2">
            Confirmando seu email...
          </h2>
          <p class="text-secondary-600">Aguarde um momento</p>
        </div>

        <!-- Success State -->
        <div v-else-if="confirmed" class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-secondary-800 mb-2">
            Email Confirmado!
          </h2>
          
          <p class="text-secondary-600 mb-6">
            Sua conta foi ativada com sucesso. Agora você já pode fazer login no sistema.
          </p>

          <BaseButton
            @click="navigateToLogin"
            variant="primary"
            size="lg"
            full-width
          >
            Ir para Login
          </BaseButton>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-secondary-800 mb-2">
            Erro na Confirmação
          </h2>
          
          <p class="text-danger-600 mb-4">
            {{ errorMessage }}
          </p>

          <p class="text-sm text-secondary-600 mb-6">
            Possíveis causas:
          </p>
          <ul class="text-sm text-secondary-600 text-left space-y-2 mb-6">
            <li>• Link expirado ou inválido</li>
            <li>• Email já confirmado anteriormente</li>
            <li>• Problemas de conexão</li>
          </ul>

          <div class="space-y-3">
            <BaseButton
              @click="retry"
              variant="primary"
              size="md"
              full-width
            >
              Tentar Novamente
            </BaseButton>
            
            <BaseButton
              @click="navigateToLogin"
              variant="outline"
              size="md"
              full-width
            >
              Voltar para Login
            </BaseButton>
          </div>
        </div>

        <!-- Default State (sem token) -->
        <div v-else class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-secondary-800 mb-2">
            Confirmação de Email
          </h2>
          
          <p class="text-secondary-600 mb-6">
            Para confirmar seu email, clique no link que enviamos para sua caixa de entrada.
          </p>

          <BaseButton
            @click="navigateToLogin"
            variant="primary"
            size="lg"
            full-width
          >
            Ir para Login
          </BaseButton>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-6 text-center">
        <p class="text-sm text-secondary-500">
          Sistema de Portaria - Confirmação de Cadastro
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseButton from '~/components/common/BaseButton.vue';

// Configuração da página
definePageMeta({
  layout: false,
  middleware: 'guest'
});

// Meta tags
useHead({
  title: 'Confirmação de Email - Sistema de Portaria',
  meta: [
    {
      name: 'description',
      content: 'Confirme seu email para ativar sua conta'
    }
  ]
});

const supabase = useSupabaseClient();
const route = useRoute();

const loading = ref(true);
const confirmed = ref(false);
const error = ref(false);
const errorMessage = ref('');

// Função para confirmar email
const confirmEmail = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    console.log('📍 Página /confirm carregada');
    console.log('🔍 URL completa:', window.location.href);
    console.log('🔍 Hash:', window.location.hash);
    
    // Extrair tipo do hash PRIMEIRO
    const type = window.location.hash.match(/type=([^&]+)/)?.[1];
    console.log('📋 Tipo detectado:', type);
    
    // VERIFICAR SE É RECUPERAÇÃO DE SENHA ANTES DE TUDO
    if (type === 'recovery') {
      console.log('🔐 Recovery detectado - redirecionando IMEDIATAMENTE');
      const fullUrl = '/redefinir-senha' + window.location.hash;
      console.log('📍 Destino:', fullUrl);
      
      // Usar replace para não criar histórico e evitar voltar para /confirm
      window.location.replace(fullUrl);
      return; // Parar execução
    }
    
    // FLUXO NORMAL DE CONFIRMAÇÃO DE EMAIL
    console.log('📧 Processando confirmação de email normal');
    
    // Verificar se há token de confirmação na URL
    const token = route.query.token || route.hash.match(/access_token=([^&]+)/)?.[1];

    console.log('🔑 Token extraído:', token ? 'Presente' : 'Ausente');

    if (!token) {
      console.log('⚠️ Nenhum token encontrado - saindo...');
      loading.value = false;
      return;
    }

    // Supabase processa automaticamente o token de confirmação
    // Verificar se usuário está autenticado após confirmação
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      confirmed.value = true;
      
      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        navigateTo('/');
      }, 2000);
    } else {
      // Tentar confirmar explicitamente se não funcionou automaticamente
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type || 'email'
      });

      if (verifyError) {
        throw verifyError;
      }

      confirmed.value = true;
    }
  } catch (err) {
    console.error('Erro na confirmação:', err);
    error.value = true;
    errorMessage.value = err.message || 'Erro ao confirmar email. Tente novamente.';
  } finally {
    loading.value = false;
  }
};

// Função para tentar novamente
const retry = () => {
  confirmEmail();
};

// Navegar para login
const navigateToLogin = () => {
  navigateTo('/login');
};

// Confirmar email ao montar
onMounted(() => {
  confirmEmail();
});
</script>
