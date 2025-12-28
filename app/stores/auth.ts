import { defineStore } from "pinia";
import type { User, AuthState, LoginCredentials, UserRole } from "~/types/auth";
import { STORAGE_KEYS, PERMISSIONS } from "~/constants/app";
import { logger } from "~/utils/logger";
import { handleAuthError } from "~/utils/errorHandler";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    loading: false,
    initialized: false,
  }),

  getters: {
    /**
     * Verificar se usuário está autenticado
     */
    isAuthenticated: (state): boolean => !!state.user,

    /**
     * Obter role do usuário
     */
    userRole: (state): UserRole | null => state.user?.role || null,

    /**
     * Verificar se usuário tem uma permissão específica
     */
    hasPermission:
      (state) =>
      (permission: string): boolean => {
        if (!state.user?.role) return false;

        const rolePermissions = {
          [PERMISSIONS.ADMIN]: [
            "view_dashboard",
            "manage_users",
            "manage_colaboradores",
            "view_reports",
            "export_data",
            "manage_system",
          ],
          [PERMISSIONS.PORTEIRO]: [
            "view_dashboard",
            "manage_colaboradores",
            "view_reports",
          ],
          [PERMISSIONS.VISUALIZADOR]: ["view_dashboard", "view_reports"],
        };

        const permissions = rolePermissions[state.user.role] || [];
        return permissions.includes(permission);
      },

    /**
     * Verificar se é admin
     */
    isAdmin: (state): boolean => state.user?.role === PERMISSIONS.ADMIN,

    /**
     * Verificar se é porteiro
     */
    isPorteiro: (state): boolean => state.user?.role === PERMISSIONS.PORTEIRO,

    /**
     * Verificar se é visualizador
     */
    isVisualizador: (state): boolean =>
      state.user?.role === PERMISSIONS.VISUALIZADOR,
  },

  actions: {
    /**
     * Inicializar autenticação
     */
    async initialize() {
      if (this.initialized) return;

      this.loading = true;

      try {
        const supabase = useSupabaseClient();

        // Obter sessão atual
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          logger.error("Erro ao obter sessão:", error);
          this.user = null;
        } else if (session?.user) {
          await this.setUser(session.user);
        }

        // Escutar mudanças de autenticação
        supabase.auth.onAuthStateChange(async (event, session) => {
          logger.debug("Auth state changed:", event);

          if (session?.user) {
            await this.setUser(session.user);
          } else {
            this.user = null;
          }
        });

        this.initialized = true;
      } catch (error) {
        logger.error("Erro ao inicializar autenticação:", error);
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fazer login
     */
    async login(credentials: LoginCredentials) {
      this.loading = true;

      try {
        const supabase = useSupabaseClient();

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          await this.setUser(data.user);
        }

        return { success: true };
      } catch (error) {
        const appError = handleAuthError(error as any, "AuthStore.login");
        logger.error("Erro no login:", appError?.userMessage);
        return {
          success: false,
          error: appError?.userMessage || "Erro ao fazer login",
        };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fazer logout
     */
    async logout() {
      this.loading = true;

      try {
        const supabase = useSupabaseClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
          const appError = handleAuthError(error as any, "AuthStore.logout");
          logger.error("Erro ao fazer logout:", appError?.userMessage);
        }

        this.user = null;

        // Limpar outros stores
        const colaboradoresStore = useColaboradoresStore();
        colaboradoresStore.limparDados();

        return { success: true };
      } catch (error) {
        const appError = handleAuthError(error, "AuthStore.logout");
        logger.error("Erro inesperado no logout:", appError?.userMessage);
        return {
          success: false,
          error: appError?.userMessage || "Erro ao fazer logout",
        };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Definir usuário e obter perfil
     */
    async setUser(authUser: any) {
      try {
        const supabaseAny: any = useSupabaseClient();

        // Buscar perfil do usuário
        const { data: profile } = await supabaseAny
          .from("user_profiles")
          .select("*")
          .eq("user_id", authUser.id)
          .single();

        this.user = {
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at,
          role: profile?.role || PERMISSIONS.VISUALIZADOR,
          profile: profile || null,
        };
      } catch (error) {
        console.error("Erro ao definir usuário:", error);

        // Fallback: usar dados básicos do auth
        this.user = {
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at,
          role: PERMISSIONS.VISUALIZADOR,
        };
      }
    },

    /**
     * Atualizar perfil do usuário
     */
    async updateProfile(profileData: Partial<any>) {
      if (!this.user) throw new Error("Usuário não autenticado");

      this.loading = true;

      try {
        const supabaseAny: any = useSupabaseClient();

        const { data, error } = await supabaseAny
          .from("user_profiles")
          .upsert({
            user_id: this.user.id,
            ...profileData,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        if (this.user) {
          this.user.profile = data;
        }

        return { success: true };
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        const e = error as any;
        return {
          success: false,
          error: e?.message || "Erro ao atualizar perfil",
        };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Verificar se pode acessar rota
     */
    canAccessRoute(requiredPermissions: string[]): boolean {
      if (!this.isAuthenticated) return false;

      return requiredPermissions.some((permission) =>
        this.hasPermission(permission)
      );
    },

    /**
     * Limpar dados de autenticação
     */
    clearAuth() {
      this.user = null;
      this.loading = false;
      this.initialized = false;
    },
  },
});
