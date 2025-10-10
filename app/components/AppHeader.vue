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
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-primary-500/30"
          >
            <UserCircleIcon class="h-5 w-5" />
            <span class="font-medium">Perfil</span>
          </button>
        </nav>

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
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-primary-500/30 w-full text-left"
            >
              <UserCircleIcon class="h-5 w-5" />
              <span class="font-medium">Perfil</span>
            </button>
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
} from "@heroicons/vue/24/outline";

// Estado do menu mobile
const isMobileMenuOpen = ref(false);

// Função para alternar menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
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
