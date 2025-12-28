import type { User, AuthError } from "@supabase/supabase-js";
import { ref, type Ref } from "vue";
import { logger } from "~/utils/logger";
import { handleAuthError } from "~/utils/errorHandler";

export const useAuth = (): {
  user: Ref<User | null>;
  loading: Ref<boolean>;
  login: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  register: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null; data: any }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  getUser: () => Promise<void>;
} => {
  const supabase = useSupabaseClient();

  // Estado global da autenticação
  const user = useState<User | null>("auth.user", () => null);
  const loading = useState<boolean>("auth.loading", () => false);

  logger.debug(
    "🔄 useAuth chamado - user:",
    user.value ? "Logado" : "Não logado",
    "loading:",
    loading.value
  );

  // Função de login
  const login = async (email: string, password: string) => {
    loading.value = true;

    try {
      console.log("🔐 useAuth.login: Tentando autenticar...");
      console.log("📧 Email:", email);
      console.log("🌐 Supabase URL:", supabase.supabaseUrl);

      // Criar promise com timeout
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout na conexão com servidor")),
          15000
        )
      );

      const { data, error } = (await Promise.race([
        loginPromise,
        timeoutPromise,
      ])) as any;

      console.log("📥 Resposta do Supabase:", {
        temUsuario: !!data?.user,
        temSessao: !!data?.session,
        temErro: !!error,
      });

      if (error) {
        const appError = handleAuthError(error, "useAuth.login");
        logger.error("❌ Erro no login:", appError?.userMessage);
        console.error("❌ Erro completo:", error);
        return { error };
      }

      if (data.user) {
        user.value = data.user;
        console.log("✅ Usuário definido no estado:", data.user.email);
        console.log("🔑 Session token existe:", !!data.session?.access_token);
        console.log(
          "🔑 Access token:",
          data.session?.access_token?.substring(0, 20) + "..."
        );
        console.log(
          "🔑 Refresh token:",
          data.session?.refresh_token?.substring(0, 20) + "..."
        );

        logger.success("Login realizado com sucesso");
      }

      return { error: null, data };
    } catch (error: any) {
      console.error("❌ Erro capturado no catch:", (error as any));
      const appError = handleAuthError(error as AuthError, "useAuth.login");
      logger.error("❌ Erro inesperado no login:", appError?.userMessage);
      return { error: error as AuthError };
    } finally {
      loading.value = false;
    }
  };

  // Função de registro
  const register = async (email: string, password: string) => {
    loading.value = true;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`,
          data: {
            email_confirmed: false,
          },
        },
      });

      if (error) {
        const appError = handleAuthError(error, "useAuth.register");
        logger.error("Erro no registro:", appError?.userMessage);
        return { error, data: null };
      }

      logger.success("Registro realizado com sucesso! Verifique seu email.");
      return { error: null, data };
    } catch (error) {
      const appError = handleAuthError(error as AuthError, "useAuth.register");
      logger.error("Erro inesperado no registro:", appError?.userMessage);
      return { error: error as AuthError, data: null };
    } finally {
      loading.value = false;
    }
  };

  // Função de logout
  const logout = async () => {
    loading.value = true;

    try {
      logger.info("🚪 Executando logout no Supabase...");

      const { error } = await supabase.auth.signOut();

      if (error) {
        const appError = handleAuthError(error, "useAuth.logout");
        logger.error("❌ Erro no logout:", appError?.userMessage);
        throw error;
      }

      // Limpar o estado do usuário
      user.value = null;

      // Limpar estados globais
      useState("auth.user", () => null);
      useState("auth.loading", () => false);

      logger.success("Logout realizado com sucesso");
    } catch (error) {
      const appError = handleAuthError(error as AuthError, "useAuth.logout");
      logger.error("❌ Erro inesperado no logout:", appError?.userMessage);
      throw error as any;
    } finally {
      loading.value = false;
    }
  };

  // Função para solicitar recuperação de senha
  const resetPassword = async (email: string) => {
    loading.value = true;

    try {
      const redirectUrl = `${window.location.origin}/redefinir-senha`;
      logger.info("🔄 Solicitando recuperação de senha...");
      logger.debug("📧 Email:", email);
      logger.debug("🔗 Redirect URL:", redirectUrl);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        const appError = handleAuthError(error, "useAuth.resetPassword");
        logger.error(
          "❌ Erro ao solicitar recuperação:",
          appError?.userMessage
        );
        return { error };
      }

      logger.success("Email de recuperação enviado com sucesso");
      return { error: null };
    } catch (error) {
      console.error(
        "❌ Erro inesperado na recuperação:",
        (error as any).message || error
      );
      return { error: error as AuthError };
    } finally {
      loading.value = false;
    }
  };

  // Função para atualizar senha (após clicar no link do email)
  const updatePassword = async (newPassword: string) => {
    loading.value = true;

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("❌ Erro ao atualizar senha:", error.message);
        return { error };
      }

      console.log("✅ Senha atualizada com sucesso!");
      return { error: null };
    } catch (error) {
      console.error(
        "❌ Erro inesperado ao atualizar senha:",
        (error as any).message || error
      );
      return { error: error as AuthError };
    } finally {
      loading.value = false;
    }
  };

  // Função para obter o usuário atual
  const getUser = async () => {
    loading.value = true;

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      user.value = currentUser;
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  // Monitorar mudanças no estado de autenticação (apenas no cliente)
  // Isso foi movido para o plugin auth-init.client.ts

  return {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    getUser,
  };
};
