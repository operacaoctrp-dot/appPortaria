<template>
  <div
    class="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center py-12 px-4"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full opacity-20 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 bg-red-100 rounded-full opacity-20 blur-3xl"
      ></div>
    </div>

    <!-- Error Content -->
    <div class="relative z-10 text-center max-w-md">
      <!-- Error Icon -->
      <div class="mb-6">
        <ShieldExclamationIcon class="h-24 w-24 text-red-500 mx-auto" />
      </div>

      <!-- Error Info -->
      <div class="space-y-4">
        <div>
          <h1 class="text-6xl font-bold text-red-600">403</h1>
          <h2 class="text-2xl font-semibold text-neutral-800 mt-2">
            Acesso Negado
          </h2>
        </div>

        <p class="text-neutral-600 leading-relaxed">
          Você não possui permissões suficientes para acessar esta página. Entre
          em contato com o administrador do sistema se acredita que isso é um
          erro.
        </p>

        <!-- User Role Info -->
        <div
          v-if="userRole"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-center space-x-2">
            <UserIcon class="h-5 w-5 text-red-600" />
            <span class="text-sm font-medium text-red-700">
              Seu nível de acesso: {{ roleLabel }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <BaseButton
            @click="goHome"
            variant="primary"
            size="lg"
            :icon="HomeIcon"
            full-width
          >
            Ir para Início
          </BaseButton>

          <BaseButton
            @click="goBack"
            variant="outline"
            size="lg"
            :icon="ArrowLeftIcon"
            full-width
          >
            Voltar
          </BaseButton>
        </div>

        <!-- Contact Admin -->
        <div class="pt-6 border-t border-neutral-200">
          <p class="text-sm text-neutral-500 mb-3">Precisa de mais acesso?</p>

          <BaseButton
            @click="contactAdmin"
            variant="secondary"
            size="sm"
            :icon="EnvelopeIcon"
          >
            Contatar Administrador
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  ShieldExclamationIcon,
  HomeIcon,
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/vue/24/outline";

// Configuração da página
definePageMeta({
  layout: false,
});

// Obter informações do usuário
const authStore = useAuthStore();
const router = useRouter();

const userRole = computed(() => authStore.userRole);

const roleLabel = computed(() => {
  const labels = {
    admin: "Administrador",
    porteiro: "Porteiro",
    visualizador: "Visualizador",
  };

  return userRole.value
    ? labels[userRole.value] || userRole.value
    : "Não definido";
});

const goHome = () => {
  navigateTo("/");
};

const goBack = () => {
  router.back();
};

const contactAdmin = () => {
  // Aqui você pode abrir um modal, enviar email, etc.
  // Por enquanto, vamos mostrar uma notificação
  const { info } = useNotifications();

  info(
    "Contato com Administrador",
    "Entre em contato através do email: admin@sistema.com ou telefone: (11) 1234-5678"
  );
};

// SEO
useHead({
  title: "Acesso Negado - Sistema de Portaria",
  meta: [
    {
      name: "description",
      content: "Acesso negado - Permissões insuficientes",
    },
  ],
});
</script>
