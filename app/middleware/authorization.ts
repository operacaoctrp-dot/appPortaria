import { PERMISSIONS, ROLES_PERMISSIONS } from "~/constants/app";

interface RoutePermissions {
  [key: string]: string[];
}

const ROUTE_PERMISSIONS: RoutePermissions = {
  "/": ["view_dashboard"],
  "/novaEntrada": ["manage_colaboradores"],
  "/dashboard": ["view_dashboard"],
  "/relatorios": ["view_reports"],
  "/configuracoes": ["manage_system"],
  "/admin": ["manage_system", "manage_users"],
};

export default defineNuxtRouteMiddleware((to) => {
  console.log("🛡️ Middleware authorization executado para:", to.path);

  if (import.meta.client) {
    // Verificar se rota requer permissões especiais
    const requiredPermissions = ROUTE_PERMISSIONS[to.path] || [];

    if (requiredPermissions.length === 0) {
      console.log("✅ Rota não requer permissões especiais");
      return;
    }

    // Obter store de autenticação
    const authStore = useAuthStore();

    // Verificar se usuário está autenticado
    if (!authStore.isAuthenticated) {
      console.log("❌ Usuário não autenticado");
      return navigateTo("/login");
    }

    // Verificar se usuário tem permissões necessárias
    const hasPermission = requiredPermissions.some((permission) =>
      authStore.hasPermission(permission)
    );

    if (!hasPermission) {
      console.log(
        "❌ Usuário não tem permissões necessárias:",
        requiredPermissions
      );
      console.log("🔑 Role do usuário:", authStore.userRole);

      // Redirecionar para página de acesso negado ou dashboard
      throw createError({
        statusCode: 403,
        statusMessage: "Acesso negado - Permissões insuficientes",
      });
    }

    console.log("✅ Usuário autorizado para acessar a rota");
  }
});
