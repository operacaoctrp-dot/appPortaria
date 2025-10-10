<template>
  <footer
    class="bg-gradient-to-r from-secondary-800 to-secondary-900 text-white"
  >
    <div class="container mx-auto px-4 py-8">
      <!-- Conteúdo Principal do Footer -->
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        <!-- Informações da Empresa -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <BuildingOfficeIcon class="h-8 w-8 text-primary-400" />
            <h3 class="text-xl font-bold">Sistema de Portaria</h3>
          </div>
          <p class="text-secondary-300 text-sm leading-relaxed">
            Solução completa para controle de entrada e saída de funcionários,
            garantindo segurança e organização em seu ambiente de trabalho.
          </p>
        </div>

        <!-- Links Úteis -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-primary-300">
            Links Úteis
          </h4>
          <nav class="space-y-2">
            <NuxtLink
              to="/"
              class="block text-secondary-300 hover:text-primary-300 transition-colors duration-200 text-sm"
            >
              Página Inicial
            </NuxtLink>
            <NuxtLink
              to="/novaEntrada"
              class="block text-secondary-300 hover:text-primary-300 transition-colors duration-200 text-sm"
            >
              Nova Entrada
            </NuxtLink>
            <a
              href="#"
              class="block text-secondary-300 hover:text-primary-300 transition-colors duration-200 text-sm"
            >
              Relatórios
            </a>
            <a
              href="#"
              class="block text-secondary-300 hover:text-primary-300 transition-colors duration-200 text-sm"
            >
              Configurações
            </a>
          </nav>
        </div>

        <!-- Informações de Contato -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-primary-300">
            Informações
          </h4>
          <div class="space-y-2">
            <div class="flex items-center space-x-2 text-secondary-300 text-sm">
              <ClockIcon class="h-4 w-4" />
              <span>Funcionamento: 24/7</span>
            </div>
            <div class="flex items-center space-x-2 text-secondary-300 text-sm">
              <ShieldCheckIcon class="h-4 w-4" />
              <span>Sistema Seguro</span>
            </div>
            <div class="flex items-center space-x-2 text-secondary-300 text-sm">
              <ComputerDesktopIcon class="h-4 w-4" />
              <span>Versão {{ appVersion }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Linha Divisória -->
      <div class="border-t border-secondary-700 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <!-- Copyright -->
          <div class="text-secondary-400 text-sm">
            © {{ currentYear }} Sistema de Portaria. Todos os direitos
            reservados.
          </div>

          <!-- Status do Sistema -->
          <div class="flex items-center space-x-2 mt-4 md:mt-0">
            <div class="flex items-center space-x-2">
              <div
                class="w-2 h-2 bg-success-500 rounded-full animate-pulse"
              ></div>
              <span class="text-success-400 text-sm font-medium"
                >Sistema Online</span
              >
            </div>
            <span class="text-secondary-500">•</span>
            <span class="text-secondary-400 text-sm">
              Última atualização: {{ lastUpdate }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import {
  BuildingOfficeIcon,
  ClockIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
} from "@heroicons/vue/24/outline";

// Dados computados
const currentYear = computed(() => new Date().getFullYear());
const appVersion = ref("1.0.0");
const lastUpdate = computed(() => {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});
</script>
