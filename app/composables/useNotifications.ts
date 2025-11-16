import { ref, reactive } from "vue";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  duration?: number;
  persistent?: boolean;
  actions?: {
    label: string;
    action: () => void;
    primary?: boolean;
  }[];
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
}

const state = reactive<NotificationState>({
  notifications: [],
  maxNotifications: 5,
});

let notificationId = 0;

export const useNotifications = () => {
  /**
   * Gerar ID único para notificação
   */
  const generateId = (): string => {
    return `notification-${++notificationId}-${Date.now()}`;
  };

  /**
   * Adicionar notificação
   */
  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt">
  ) => {
    const newNotification: Notification = {
      id: generateId(),
      createdAt: new Date(),
      duration: 5000, // 5 segundos por padrão
      ...notification,
    };

    // Adicionar no início da lista
    state.notifications.unshift(newNotification);

    // Limitar número de notificações
    if (state.notifications.length > state.maxNotifications) {
      state.notifications = state.notifications.slice(
        0,
        state.maxNotifications
      );
    }

    // Auto remover se não for persistente
    if (
      !newNotification.persistent &&
      newNotification.duration &&
      newNotification.duration > 0
    ) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    }

    return newNotification.id;
  };

  /**
   * Remover notificação
   */
  const removeNotification = (id: string) => {
    const index = state.notifications.findIndex((n) => n.id === id);
    if (index > -1) {
      state.notifications.splice(index, 1);
    }
  };

  /**
   * Limpar todas as notificações
   */
  const clearNotifications = () => {
    state.notifications = [];
  };

  /**
   * Atualizar notificação existente
   */
  const updateNotification = (
    id: string,
    updates: Partial<Omit<Notification, "id" | "createdAt">>
  ) => {
    const index = state.notifications.findIndex((n) => n.id === id);
    if (index > -1) {
      const notification = state.notifications[index]!;
      if (updates.title !== undefined) notification.title = updates.title;
      if (updates.message !== undefined) notification.message = updates.message;
      if (updates.type !== undefined) notification.type = updates.type;
      if (updates.duration !== undefined)
        notification.duration = updates.duration;
      if (updates.persistent !== undefined)
        notification.persistent = updates.persistent;
      if (updates.actions !== undefined) notification.actions = updates.actions;
    }
  };

  /**
   * Métodos de conveniência para tipos específicos
   */
  const success = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      title,
      message,
      type: "success",
      ...options,
    });
  };

  const error = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      title,
      message,
      type: "error",
      duration: 8000, // Erros ficam mais tempo
      ...options,
    });
  };

  const warning = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      title,
      message,
      type: "warning",
      duration: 6000,
      ...options,
    });
  };

  const info = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      title,
      message,
      type: "info",
      ...options,
    });
  };

  /**
   * Notificação de loading/progresso
   */
  const loading = (title: string, message?: string) => {
    return addNotification({
      title,
      message,
      type: "info",
      persistent: true,
      duration: 0,
    });
  };

  /**
   * Confirmar ação com notificação
   */
  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    return addNotification({
      title,
      message,
      type: "warning",
      persistent: true,
      actions: [
        {
          label: "Confirmar",
          primary: true,
          action: () => {
            onConfirm();
          },
        },
        {
          label: "Cancelar",
          action: () => {
            if (onCancel) onCancel();
          },
        },
      ],
    });
  };

  /**
   * Notificação de progresso de operação
   */
  const operationProgress = (operation: string, steps: string[]) => {
    let currentStep = 0;

    const id = loading(`Executando: ${operation}`, steps[0]);

    const nextStep = () => {
      currentStep++;
      if (currentStep < steps.length) {
        updateNotification(id, {
          message: steps[currentStep],
        });
        return nextStep;
      } else {
        removeNotification(id);
        return null;
      }
    };

    const complete = (successMessage?: string) => {
      removeNotification(id);
      if (successMessage) {
        success(operation, successMessage);
      }
    };

    const fail = (errorMessage: string) => {
      removeNotification(id);
      error(`Erro em: ${operation}`, errorMessage);
    };

    return {
      nextStep,
      complete,
      fail,
      id,
    };
  };

  return {
    // Estado
    notifications: state.notifications,

    // Métodos
    addNotification,
    removeNotification,
    clearNotifications,
    updateNotification,

    // Métodos de conveniência
    success,
    error,
    warning,
    info,
    loading,
    confirm,
    operationProgress,
  };
};

// Instância global para usar em qualquer lugar
export const notifications = useNotifications();
