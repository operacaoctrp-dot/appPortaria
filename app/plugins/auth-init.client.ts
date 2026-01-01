export default defineNuxtPlugin(() => {
  const user = useState("auth.user", () => null);
  const authReady = useState("auth.ready", () => false);

  console.log("🔌 Plugin auth-init: Iniciando...");

  // Inicializar autenticação de forma não-bloqueante
  const initAuth = async () => {
    try {
      const supabase = useSupabaseClient();

      // Verificar se o cliente Supabase está disponível
      if (!supabase || !supabase.auth) {
        console.warn("⚠️ Cliente Supabase não disponível");
        authReady.value = true;
        return;
      }

      console.log("🔍 Verificando sessão existente...");
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user) {
        user.value = session.user;
        console.log("✅ Sessão restaurada:", session.user.email);
        console.log(
          "🔑 Token válido até:",
          new Date((session.expires_at ?? 0) * 1000).toLocaleString()
        );
      } else {
        console.log("📭 Nenhuma sessão encontrada");
        user.value = null;
      }

      // Marcar como pronto - CRÍTICO para middleware continuar
      authReady.value = true;
      console.log("✅ Plugin auth-init pronto");

      // Monitorar mudanças de autenticação em tempo real
      supabase.auth.onAuthStateChange((event, session) => {
        console.log("🔔 Auth state changed:", event, session?.user?.email);
        user.value = session?.user || null;
      });
    } catch (err) {
      console.error("❌ Erro no plugin auth-init:", err);
      authReady.value = true;
      user.value = null;
    }
  };

  // Executar imediatamente - fire and forget
  initAuth();
});
