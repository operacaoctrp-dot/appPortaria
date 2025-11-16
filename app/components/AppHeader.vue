<template>
  <header
    class="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-strong"
  >
    <div class="container mx-auto px-4 py-6">
      <!-- Logo e Título -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <BuildingOfficeIcon class="h-10 w-10 text-primary-100" />
          <div>
            <h1 class="text-3xl font-bold">Sistema de Portaria</h1>
            <p class="text-primary-100 text-sm">Controle de Acesso</p>
          </div>
        </div>

        <!-- Menu de Navegação -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-primary-500/30"
            :class="{ 'bg-primary-500/50': $route.path === '/' }"
          >
            <HomeIcon class="h-5 w-5" />
            <span class="font-medium">Início</span>
          </NuxtLink>

          <NuxtLink
            to="/novaEntrada"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-primary-500/30"
            :class="{ 'bg-primary-500/50': $route.path === '/novaEntrada' }"
          >
            <PlusCircleIcon class="h-5 w-5" />
            <span class="font-medium">Nova Entrada</span>
          </NuxtLink>

          <button
            @click="handleLogout"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-red-500/30 text-red-100"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
            <span class="font-medium">Sair</span>
          </button>
        </nav>

        <!-- PWA Install + Theme Toggle -->
        <div class="hidden md:flex items-center space-x-3">
          <PWAInstall />
          <ThemeToggle />
        </div>

        <!-- Menu Mobile -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-primary-500/30 transition-colors duration-200"
        >
          <Bars3Icon v-if="!isMobileMenuOpen" class="h-6 w-6" />
          <XMarkIcon v-else class="h-6 w-6" />
        </button>
      </div>

      <!-- Menu Mobile Expandido -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <nav
          v-if="isMobileMenuOpen"
          class="md:hidden mt-4 pt-4 border-t border-primary-500/30"
        >
          <div class="space-y-2">
            <NuxtLink
              to="/"
              @click="isMobileMenuOpen = false"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-primary-500/30"
              :class="{ 'bg-primary-500/50': $route.path === '/' }"
            >
              <HomeIcon class="h-5 w-5" />
              <span class="font-medium">Início</span>
            </NuxtLink>

            <NuxtLink
              to="/novaEntrada"
              @click="isMobileMenuOpen = false"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-primary-500/30"
              :class="{ 'bg-primary-500/50': $route.path === '/novaEntrada' }"
            >
              <PlusCircleIcon class="h-5 w-5" />
              <span class="font-medium">Nova Entrada</span>
            </NuxtLink>

            <button
              @click="handleLogout"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-red-500/30 text-red-100 w-full text-left"
            >
              <ArrowRightOnRectangleIcon class="h-5 w-5" />
              <span class="font-medium">Sair</span>
            </button>

            <!-- PWA e Theme Toggle no Mobile -->
            <div class="border-t border-primary-500/30 pt-3 mt-3 space-y-3">
              <div class="px-4">
                <PWAInstall />
              </div>
              <div class="px-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import {
  BuildingOfficeIcon,
  HomeIcon,
  PlusCircleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";

// Estado do menu mobile
const isMobileMenuOpen = ref(false);

// Auth
const { logout } = useAuth();
const router = useRouter();

// Função para alternar menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Função de logout
const handleLogout = async () => {
  console.log("🚪 Iniciando logout...");

  try {
    // Fechar menu mobile se estiver aberto
    isMobileMenuOpen.value = false;

    // Fazer logout
    await logout();

    console.log("✅ Logout realizado, redirecionando para login...");

    // Redirecionar para login
    await router.push("/login");

    // Recarregar a página para limpar estado
    window.location.reload();
  } catch (error) {
    console.error("❌ Erro no logout:", error);
  }
};

// Fechar menu mobile quando a rota mudar
const route = useRoute();
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  }
);
</script>
