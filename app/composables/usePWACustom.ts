import { ref, computed, onMounted } from "vue";
import { useNotifications } from "./useNotifications";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWACustom = () => {
  // Estado
  const isInstallable = ref(false);
  const isInstalled = ref(false);
  const isOnline = ref(true);
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
  const installPromptShown = ref(false);

  /**
   * Verificar se está instalado como PWA
   */
  const checkIfInstalled = () => {
    if (process.client) {
      // Verificar se está rodando em modo standalone (instalado)
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

      // Verificar se é iOS Safari em modo standalone
      const isIOSStandalone = (window.navigator as any).standalone === true;

      // Verificar se tem window.chrome (indica que não é instalado no Chrome)
      const isChromeApp =
        !!(window as any).chrome && !(window as any).chrome.webstore;

      isInstalled.value = isStandalone || isIOSStandalone || isChromeApp;
    }
  };

  /**
   * Verificar status de conexão
   */
  const checkOnlineStatus = () => {
    if (process.client) {
      isOnline.value = navigator.onLine;
    }
  };

  /**
   * Mostrar prompt de instalação
   */
  const showInstallPrompt = async () => {
    if (!deferredPrompt.value) {
      console.log("Prompt de instalação não disponível");
      return false;
    }

    try {
      // Mostrar o prompt de instalação
      await deferredPrompt.value.prompt();

      // Aguardar a escolha do usuário
      const choiceResult = await deferredPrompt.value.userChoice;

      console.log("Resultado da instalação:", choiceResult.outcome);

      if (choiceResult.outcome === "accepted") {
        console.log("PWA instalado com sucesso");
        isInstalled.value = true;

        // Mostrar notificação de sucesso
        const { success } = useNotifications();
        success(
          "Aplicativo Instalado!",
          "O Sistema de Portaria foi instalado com sucesso"
        );
      } else {
        console.log("Instalação da PWA cancelada");
      }

      // Limpar o prompt (só pode ser usado uma vez)
      deferredPrompt.value = null;
      isInstallable.value = false;

      return choiceResult.outcome === "accepted";
    } catch (error) {
      console.error("Erro ao mostrar prompt de instalação:", error);
      return false;
    }
  };

  /**
   * Verificar se pode mostrar prompt de instalação
   */
  const canInstall = computed(() => {
    return isInstallable.value && !isInstalled.value && deferredPrompt.value;
  });

  /**
   * Obter informações sobre a plataforma
   */
  const getPlatformInfo = () => {
    if (!process.client) return null;

    const userAgent = navigator.userAgent;

    // Detectar plataforma
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);
    const isDesktop = !isMobile;

    // Detectar navegador
    const isChrome =
      /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(userAgent);
    const isSafari =
      /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
    const isEdge = /Edg/.test(userAgent);

    return {
      isIOS,
      isAndroid,
      isMobile,
      isDesktop,
      isChrome,
      isFirefox,
      isSafari,
      isEdge,
      supportsInstallation: (isChrome || isEdge) && !isInstalled.value,
    };
  };

  /**
   * Obter instruções de instalação específicas da plataforma
   */
  const getInstallInstructions = () => {
    const platform = getPlatformInfo();

    if (!platform) return null;

    if (platform.isIOS && platform.isSafari) {
      return {
        title: "Instalar no iOS Safari",
        steps: [
          "Toque no ícone de compartilhamento (quadrado com seta)",
          'Role para baixo e toque em "Adicionar à Tela de Início"',
          'Toque em "Adicionar" no canto superior direito',
        ],
      };
    }

    if (platform.isAndroid && platform.isChrome) {
      return {
        title: "Instalar no Android Chrome",
        steps: [
          "Toque no menu (três pontos) no canto superior direito",
          'Toque em "Instalar aplicativo" ou "Adicionar à tela inicial"',
          'Confirme tocando em "Instalar"',
        ],
      };
    }

    if (platform.isDesktop && (platform.isChrome || platform.isEdge)) {
      return {
        title: "Instalar no Desktop",
        steps: [
          "Clique no ícone de instalação na barra de endereços",
          'Ou use o menu do navegador > "Instalar Sistema de Portaria"',
          'Clique em "Instalar" na janela que aparecer',
        ],
      };
    }

    return null;
  };

  /**
   * Registrar service worker manualmente (se necessário)
   */
  const registerServiceWorker = async () => {
    if (!process.client || !("serviceWorker" in navigator)) {
      console.log("Service Worker não é suportado");
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registrado com sucesso:", registration);

      // Verificar updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Nova versão disponível
              const { info } = useNotifications();
              info(
                "Nova versão disponível",
                "Recarregue a página para usar a versão mais recente",
                {
                  persistent: true,
                  actions: [
                    {
                      label: "Recarregar",
                      primary: true,
                      action: () => window.location.reload(),
                    },
                  ],
                }
              );
            }
          });
        }
      });

      return true;
    } catch (error) {
      console.error("Erro ao registrar Service Worker:", error);
      return false;
    }
  };

  /**
   * Inicializar PWA
   */
  const initPWA = () => {
    if (!process.client) return;

    // Verificar se já está instalado
    checkIfInstalled();

    // Verificar status online
    checkOnlineStatus();

    // Event listeners
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      // Prevenir o prompt automático
      e.preventDefault();

      // Salvar o evento para uso posterior
      deferredPrompt.value = e as BeforeInstallPromptEvent;
      isInstallable.value = true;

      console.log("PWA é instalável");

      // Mostrar notificação sobre instalação (opcional)
      if (!installPromptShown.value) {
        const { info } = useNotifications();
        info(
          "Instalar Aplicativo",
          "Você pode instalar o Sistema de Portaria para acesso mais rápido",
          {
            actions: [
              {
                label: "Instalar",
                primary: true,
                action: showInstallPrompt,
              },
            ],
          }
        );
        installPromptShown.value = true;
      }
    });

    // Detectar quando a app foi instalada
    window.addEventListener("appinstalled", () => {
      console.log("PWA foi instalado");
      isInstalled.value = true;
      isInstallable.value = false;
      deferredPrompt.value = null;

      const { success } = useNotifications();
      success(
        "Aplicativo Instalado!",
        "Agora você pode acessar o sistema diretamente da sua tela inicial"
      );
    });

    // Monitorar mudanças de conectividade
    window.addEventListener("online", () => {
      isOnline.value = true;
      const { success } = useNotifications();
      success("Conexão Restaurada", "Você está online novamente");
    });

    window.addEventListener("offline", () => {
      isOnline.value = false;
      const { warning } = useNotifications();
      warning("Sem Conexão", "Você está trabalhando no modo offline");
    });

    // Registrar service worker (se não for automático)
    registerServiceWorker();
  };

  return {
    // Estado
    isInstallable: readonly(isInstallable),
    isInstalled: readonly(isInstalled),
    isOnline: readonly(isOnline),
    canInstall,

    // Métodos
    showInstallPrompt,
    checkIfInstalled,
    getPlatformInfo,
    getInstallInstructions,
    registerServiceWorker,
    initPWA,
  };
};

// Instância global
export const pwa = usePWACustom();
