import type { UserRole } from "~/types/auth";
import { PERMISSIONS, ROLES_PERMISSIONS } from "~/constants/app";

export const usePermissions = () => {
  /**
   * Verificar se usuário tem uma permissão específica
   */
  const hasPermission = (permission: string, userRole?: UserRole): boolean => {
    if (!userRole) return false;

    const permissions = ROLES_PERMISSIONS[userRole] || [];
    return (permissions as string[]).includes(permission);
  };

  /**
   * Verificar se usuário pode acessar múltiplas permissões (OR)
   */
  const hasAnyPermission = (
    permissions: string[],
    userRole?: UserRole
  ): boolean => {
    if (!userRole) return false;

    return permissions.some((permission) =>
      hasPermission(permission, userRole)
    );
  };

  /**
   * Verificar se usuário tem todas as permissões (AND)
   */
  const hasAllPermissions = (
    permissions: string[],
    userRole?: UserRole
  ): boolean => {
    if (!userRole) return false;

    return permissions.every((permission) =>
      hasPermission(permission, userRole)
    );
  };

  /**
   * Obter todas as permissões de um role
   */
  const getRolePermissions = (role: UserRole): readonly string[] => {
    return ROLES_PERMISSIONS[role] || [];
  };

  /**
   * Verificar se é admin
   */
  const isAdmin = (userRole?: UserRole): boolean => {
    return userRole === PERMISSIONS.ADMIN;
  };

  /**
   * Verificar se é porteiro
   */
  const isPorteiro = (userRole?: UserRole): boolean => {
    return userRole === PERMISSIONS.PORTEIRO;
  };

  /**
   * Verificar se é visualizador
   */
  const isVisualizador = (userRole?: UserRole): boolean => {
    return userRole === PERMISSIONS.VISUALIZADOR;
  };

  /**
   * Obter nível hierárquico do role (maior = mais permissões)
   */
  const getRoleLevel = (role: UserRole): number => {
    const levels = {
      [PERMISSIONS.ADMIN]: 3,
      [PERMISSIONS.PORTEIRO]: 2,
      [PERMISSIONS.VISUALIZADOR]: 1,
    };

    return levels[role] || 0;
  };

  /**
   * Verificar se um role pode gerenciar outro
   */
  const canManageRole = (
    managerRole: UserRole,
    targetRole: UserRole
  ): boolean => {
    return getRoleLevel(managerRole) > getRoleLevel(targetRole);
  };

  /**
   * Filtrar itens baseado em permissões
   */
  const filterByPermissions = <T extends { requiredPermissions?: string[] }>(
    items: T[],
    userRole?: UserRole
  ): T[] => {
    if (!userRole) return [];

    return items.filter((item) => {
      if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
        return true;
      }

      return hasAnyPermission(item.requiredPermissions, userRole);
    });
  };

  /**
   * Verificar se usuário pode executar uma ação
   */
  const canPerformAction = (action: string, userRole?: UserRole): boolean => {
    const actionPermissions = {
      create_user: ["manage_users"],
      delete_user: ["manage_users"],
      edit_user: ["manage_users"],
      view_users: ["manage_users", "view_reports"],
      create_colaborador: ["manage_colaboradores"],
      edit_colaborador: ["manage_colaboradores"],
      delete_colaborador: ["manage_colaboradores"],
      view_colaboradores: ["manage_colaboradores", "view_dashboard"],
      export_data: ["export_data"],
      view_reports: ["view_reports"],
      manage_system: ["manage_system"],
    };

    const requiredPermissions =
      actionPermissions[action as keyof typeof actionPermissions] || [];
    return hasAnyPermission(requiredPermissions, userRole);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getRolePermissions,
    isAdmin,
    isPorteiro,
    isVisualizador,
    getRoleLevel,
    canManageRole,
    filterByPermissions,
    canPerformAction,
  };
};
