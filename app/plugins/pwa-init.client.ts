import { pwa } from "~/composables/usePWACustom";

export default defineNuxtPlugin(() => {
  // Inicializar PWA no client-side
  if (process.client) {
    // Aguardar o próximo tick para garantir que tudo está carregado
    nextTick(() => {
      pwa.initPWA();
    });
  }
});
