<template>
  <div class="pwa-install">
    <!-- Botão de instalação usando VueUse PWA -->
    <BaseButton
      v-if="showInstallPrompt && !isPWAInstalled"
      @click="install"
      variant="secondary"
      class="pwa-install-button"
    >
      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      </svg>
      Instalar App
    </BaseButton>

    <!-- Status indicators -->
    <div v-if="isPWAInstalled" class="pwa-status installed">
      <svg
        class="w-4 h-4 text-green-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        />
      </svg>
      <span class="text-sm text-gray-600 dark:text-gray-300 ml-1">
        App Instalado
      </span>
    </div>

    <div v-if="!isOnline" class="pwa-status offline">
      <svg
        class="w-4 h-4 text-orange-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M24.24 8L17 1c-.69-.7-1.82-.7-2.51 0L7 8.5c-.69.7-.69 1.82 0 2.51l7.49 7.49c.69.7 1.82.7 2.51 0L24.24 10.5c.69-.7.69-1.82 0-2.5zM16 17.5L8.5 10 16 2.5 23.5 10 16 17.5z"
        />
      </svg>
      <span class="text-sm text-gray-600 dark:text-gray-300 ml-1">
        Modo Offline
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "~/components/common/BaseButton.vue";

interface Props {
  showText?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showText: true,
  compact: false,
});

// Usar VueUse PWA (que já está instalado)
const { isPWAInstalled, showInstallPrompt, install } = usePWA();

// Estado de conectividade
const isOnline = useOnline();
</script>

<style scoped>
.pwa-install {
  @apply flex items-center gap-3;
}

.pwa-install-button {
  @apply bg-blue-600 hover:bg-blue-700 text-white border-blue-600;
  transition: all 0.2s ease;
}

.pwa-install-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.pwa-status {
  @apply flex items-center;
}

.pwa-status.installed {
  @apply bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md;
}

.pwa-status.offline {
  @apply bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md;
}

/* Responsive */
@media (max-width: 640px) {
  .pwa-install {
    @apply flex-col items-stretch gap-2;
  }

  .pwa-install-button {
    @apply w-full justify-center;
  }
}
</style>
