<template>
  <Teleport to="body">
    <!-- Container de Notificações -->
    <div
      :class="[
        'fixed z-50 flex flex-col space-y-3 pointer-events-none',
        positionClasses,
      ]"
    >
      <TransitionGroup
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0 scale-95"
        enter-to-class="translate-x-0 opacity-100 scale-100"
        leave-active-class="transform transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100 scale-100"
        leave-to-class="translate-x-full opacity-0 scale-95"
        move-class="transition-all duration-300"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'pointer-events-auto max-w-sm w-full bg-white dark:bg-neutral-800 shadow-lg rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden',
            'animate-fade-in',
          ]"
        >
          <!-- Header da Notificação -->
          <div
            :class="[
              'flex items-start p-4',
              getNotificationClasses(notification.type),
            ]"
          >
            <!-- Ícone -->
            <div class="flex-shrink-0 mr-3">
              <component
                :is="getNotificationIcon(notification.type)"
                :class="['w-5 h-5', getIconClasses(notification.type)]"
              />
            </div>

            <!-- Conteúdo -->
            <div class="flex-1 min-w-0">
              <h4
                :class="[
                  'text-sm font-medium',
                  getTitleClasses(notification.type),
                ]"
              >
                {{ notification.title }}
              </h4>

              <p
                v-if="notification.message"
                class="mt-1 text-sm text-neutral-600 dark:text-neutral-300"
              >
                {{ notification.message }}
              </p>

              <!-- Ações -->
              <div
                v-if="notification.actions && notification.actions.length > 0"
                class="mt-3 flex space-x-2"
              >
                <button
                  v-for="action in notification.actions"
                  :key="action.label"
                  @click="handleAction(notification.id, action)"
                  :class="[
                    'text-xs px-3 py-1.5 rounded-md font-medium transition-colors',
                    action.primary
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-300',
                  ]"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>

            <!-- Botão de fechar -->
            <button
              @click="removeNotification(notification.id)"
              class="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <XMarkIcon
                class="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              />
            </button>
          </div>

          <!-- Progress Bar (para notificações com duração) -->
          <div
            v-if="!notification.persistent && notification.duration"
            class="h-1 bg-neutral-200 dark:bg-neutral-700 overflow-hidden"
          >
            <div
              :class="[
                'h-full transition-all ease-linear',
                getProgressBarClasses(notification.type),
              ]"
              :style="{
                width: '100%',
                animation: `shrink ${notification.duration}ms linear forwards`,
              }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import type { NotificationType } from "~/composables/useNotifications";

type Position =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface Props {
  position?: Position;
}

const props = withDefaults(defineProps<Props>(), {
  position: "top-right",
});

// Usar composable de notificações
const { notifications, removeNotification } = useNotifications();

// Classes de posicionamento
const positionClasses = computed(() => {
  const positions = {
    "top-right": "top-4 right-4 safe-top safe-right",
    "top-left": "top-4 left-4 safe-top safe-left",
    "bottom-right": "bottom-4 right-4 safe-bottom safe-right",
    "bottom-left": "bottom-4 left-4 safe-bottom safe-left",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2 safe-top",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2 safe-bottom",
  };

  return positions[props.position];
});

// Ícones para cada tipo
const getNotificationIcon = (type: NotificationType) => {
  const icons = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };

  return icons[type];
};

// Classes do container da notificação
const getNotificationClasses = (type: NotificationType) => {
  const classes = {
    success: "border-l-4 border-l-success-500",
    error: "border-l-4 border-l-danger-500",
    warning: "border-l-4 border-l-warning-500",
    info: "border-l-4 border-l-primary-500",
  };

  return classes[type];
};

// Classes do ícone
const getIconClasses = (type: NotificationType) => {
  const classes = {
    success: "text-success-500",
    error: "text-danger-500",
    warning: "text-warning-500",
    info: "text-primary-500",
  };

  return classes[type];
};

// Classes do título
const getTitleClasses = (type: NotificationType) => {
  const classes = {
    success: "text-success-800 dark:text-success-300",
    error: "text-danger-800 dark:text-danger-300",
    warning: "text-warning-800 dark:text-warning-300",
    info: "text-primary-800 dark:text-primary-300",
  };

  return classes[type];
};

// Classes da barra de progresso
const getProgressBarClasses = (type: NotificationType) => {
  const classes = {
    success: "bg-success-500",
    error: "bg-danger-500",
    warning: "bg-warning-500",
    info: "bg-primary-500",
  };

  return classes[type];
};

// Manipular ações
const handleAction = (
  notificationId: string,
  action: { label: string; action: () => void }
) => {
  action.action();
  removeNotification(notificationId);
};
</script>

<style scoped>
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
