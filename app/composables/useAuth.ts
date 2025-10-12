import type { User, AuthError } from "@supabase/supabase-js";
import { ref, onMounted, type Ref } from "vue";

export const useAuth = (): {
  user: Ref<User | null>;
  loading: Ref<boolean>;
  login: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
} => {
  const supabase = useSupabaseClient();

  // Estado global da autenticação
  const user = useState<User | null>("auth.user", () => null);
  const loading = useState<boolean>("auth.loading", () => true);

  console.log(
    "🔄 useAuth chamado - user:",
    user.value ? "Logado" : "Não logado",
    "loading:",
    loading.value
  );

  // Função de login
  const login = async (email: string, password: string) => {
    loading.value = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro no login:", error);
        return { error };
      }

      if (data.user) {
        user.value = data.user;
        console.log("Login realizado com sucesso!");
      }

      return { error: null };
    } catch (error) {
      console.error("Erro inesperado no login:", error);
      return { error: error as AuthError };
    } finally {
      loading.value = false;
    }
  };

  // Função de logout
  const logout = async () => {
    loading.value = true;

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro no logout:", error);
      }

      user.value = null;
      console.log("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro inesperado no logout:", error);
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

  // Monitorar mudanças no estado de autenticação
  onMounted(() => {
    supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === "SIGNED_IN" && session?.user) {
        user.value = session.user;
        console.log("Usuário logado via auth state change");
      } else if (event === "SIGNED_OUT") {
        user.value = null;
        console.log("Usuário deslogado via auth state change");
      }
    });

    // Obter usuário inicial apenas no cliente
    if (process.client) {
      getUser();
    }
  });

  return {
    user,
    loading,
    login,
    logout,
    getUser,
  };
};
