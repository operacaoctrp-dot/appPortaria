import { ref, computed, watch } from "vue";
import { THEMES, STORAGE_KEYS } from "~/constants/app";

type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  // Estado do tema
  const currentTheme = ref<Theme>("system");
  const systemTheme = ref<"light" | "dark">("light");

  /**
   * Tema efetivo (considerando system preference)
   */
  const effectiveTheme = computed(() => {
    if (currentTheme.value === "system") {
      return systemTheme.value;
    }
    return currentTheme.value as "light" | "dark";
  });

  /**
   * Verificar se está no modo escuro
   */
  const isDark = computed(() => effectiveTheme.value === "dark");

  /**
   * Detectar preferência do sistema
   */
  const detectSystemTheme = () => {
    if (import.meta.client) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      systemTheme.value = prefersDark ? "dark" : "light";
    }
  };

  /**
   * Aplicar tema no DOM
   */
  const applyTheme = (theme: "light" | "dark") => {
    if (import.meta.client) {
      const html = document.documentElement;
      if (theme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  };

  /**
   * Salvar tema no localStorage
   */
  const saveTheme = (theme: Theme) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
      } catch (error) {
        console.error("Erro ao salvar tema:", error);
      }
    }
  };

  /**
   * Carregar tema do localStorage
   */
  const loadTheme = (): Theme => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME);
        if (saved && Object.values(THEMES).includes(saved as Theme)) {
          return saved as Theme;
        }
      } catch (error) {
        console.error("Erro ao carregar tema:", error);
      }
    }
    return "system";
  };

  /**
   * Definir tema
   */
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    saveTheme(theme);

    // Aplicar tema imediatamente
    const effectiveThemeValue =
      theme === "system" ? systemTheme.value : (theme as "light" | "dark");
    applyTheme(effectiveThemeValue);
  };

  /**
   * Alternar entre light e dark
   */
  const toggleTheme = () => {
    if (currentTheme.value === "system") {
      // Se está em system, vai para o oposto do sistema
      setTheme(systemTheme.value === "dark" ? "light" : "dark");
    } else {
      // Se está em modo específico, alterna
      setTheme(currentTheme.value === "dark" ? "light" : "dark");
    }
  };

  /**
   * Resetar para tema do sistema
   */
  const resetToSystem = () => {
    setTheme("system");
  };

  /**
   * Inicializar tema
   */
  const initTheme = () => {
    if (import.meta.client) {
      detectSystemTheme();
      const savedTheme = loadTheme();
      currentTheme.value = savedTheme;
      const initialTheme =
        savedTheme === "system" ? systemTheme.value : (savedTheme as "light" | "dark");
      applyTheme(initialTheme);
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        systemTheme.value = e.matches ? "dark" : "light";
        if (currentTheme.value === "system") {
          applyTheme(systemTheme.value);
        }
      };
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      watch(effectiveTheme, (newTheme) => {
        applyTheme(newTheme);
      });
    }
  };

  /**
   * Obter ícone para o tema atual
   */
  const getThemeIcon = () => {
    switch (currentTheme.value) {
      case "light":
        return "sun";
      case "dark":
        return "moon";
      case "system":
        return "desktop";
      default:
        return "desktop";
    }
  };

  /**
   * Obter label para o tema atual
   */
  const getThemeLabel = () => {
    switch (currentTheme.value) {
      case "light":
        return "Modo Claro";
      case "dark":
        return "Modo Escuro";
      case "system":
        return "Sistema";
      default:
        return "Sistema";
    }
  };

  /**
   * Lista de temas disponíveis
   */
  const availableThemes = [
    {
      value: "light" as Theme,
      label: "Claro",
      icon: "sun",
    },
    {
      value: "dark" as Theme,
      label: "Escuro",
      icon: "moon",
    },
    {
      value: "system" as Theme,
      label: "Sistema",
      icon: "desktop",
    },
  ];

  return {
    // Estado
    currentTheme: readonly(currentTheme),
    systemTheme: readonly(systemTheme),
    effectiveTheme,
    isDark,

    // Métodos
    setTheme,
    toggleTheme,
    resetToSystem,
    initTheme,
    getThemeIcon,
    getThemeLabel,

    // Dados
    availableThemes,
  };
};

// Instância global
export const theme = useTheme();
