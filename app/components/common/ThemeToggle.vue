<template>
  <div class="theme-toggle">
    <button
      @click="toggleTheme"
      :title="isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
      class="theme-toggle-btn"
      :class="{
        'theme-toggle-btn--dark': isDark,
        'theme-toggle-btn--light': !isDark,
      }"
    >
      <!-- Ícone do Sol (tema claro) -->
      <svg
        v-if="!isDark"
        class="w-5 h-5 transition-transform duration-300 rotate-0"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
        />
      </svg>

      <!-- Ícone da Lua (tema escuro) -->
      <svg
        v-else
        class="w-5 h-5 transition-transform duration-300 -rotate-90"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fill-rule="evenodd"
          d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
          clip-rule="evenodd"
        />
      </svg>

      <span class="sr-only">
        {{ isDark ? "Mudar para tema claro" : "Mudar para tema escuro" }}
      </span>
    </button>

    <!-- Label opcional -->
    <span v-if="showLabel" class="theme-label">
      {{ isDark ? "Escuro" : "Claro" }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showLabel?: boolean;
  variant?: "button" | "switch";
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: false,
  variant: "button",
});

// Estado do tema
const theme = ref("light");
const isDark = computed(() => theme.value === "dark");

/**
 * Alternar tema
 */
const toggleTheme = () => {
  if (process.client) {
    const newTheme = isDark.value ? "light" : "dark";
    setTheme(newTheme);
  }
};

/**
 * Definir tema
 */
const setTheme = (newTheme: string) => {
  if (process.client) {
    theme.value = newTheme;

    // Aplicar classe no documento
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Salvar preferência
    localStorage.setItem("theme-preference", newTheme);

    console.log(`Tema alterado para: ${newTheme}`);
  }
};

/**
 * Carregar tema salvo
 */
const loadSavedTheme = () => {
  if (process.client) {
    // Verificar tema salvo
    const saved = localStorage.getItem("theme-preference");

    // Verificar preferência do sistema
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Determinar tema inicial
    const initialTheme = saved || (prefersDark ? "dark" : "light");

    setTheme(initialTheme);
  }
};

/**
 * Observar mudanças na preferência do sistema
 */
const watchSystemTheme = () => {
  if (process.client) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", (e) => {
      // Só mudar automaticamente se não houver preferência salva
      const saved = localStorage.getItem("theme-preference");
      if (!saved) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
  }
};

// Inicializar quando componente montar
onMounted(() => {
  loadSavedTheme();
  watchSystemTheme();
});
</script>

<style scoped>
.theme-toggle {
  @apply flex items-center gap-2;
}

.theme-toggle-btn {
  @apply p-2 rounded-lg border transition-all duration-200 ease-in-out;
  @apply hover:scale-110 active:scale-95;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  @apply dark:focus:ring-offset-gray-800;
}

.theme-toggle-btn--light {
  @apply bg-yellow-50 border-yellow-200 text-yellow-600;
  @apply hover:bg-yellow-100 hover:border-yellow-300;
}

.theme-toggle-btn--dark {
  @apply bg-blue-900 border-blue-700 text-blue-300;
  @apply hover:bg-blue-800 hover:border-blue-600;
}

.theme-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

/* Animação dos ícones */
.theme-toggle-btn svg {
  transition: transform 0.3s ease-in-out;
}

.theme-toggle-btn:hover svg {
  transform: rotate(180deg);
}

/* Estados de loading */
.theme-toggle-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.theme-toggle-btn:disabled:hover {
  @apply scale-100;
}
</style>
