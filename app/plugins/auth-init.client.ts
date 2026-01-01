export default defineNuxtPlugin(async (nuxtApp) => {
  const user = useState("auth.user");
  const authReady = useState("auth.ready", () => false);

  console.log("🔌 Plugin auth-init: Iniciando...");

  // Aguardar o hook app:mounted para garantir que o Supabase esteja disponível
  nuxtApp.hook("app:mounted", async () => {
    try {
      const supabase = useSupabaseClient();

      // Verificar se o cliente Supabase está disponível
      if (!supabase || !supabase.auth) {
        console.warn("⚠️ Cliente Supabase não disponível ainda");
        authReady.value = false;
        return;
      }

      console.log("🔍 Verificando sessão existente...");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        user.value = session.user;
        console.log("✅ Sessão restaurada:", session.user.email);
        console.log(
          "🔑 Token válido até:",
          new Date((session.expires_at ?? 0) * 1000).toLocaleString()
        );
      } else {
        console.log("❌ Nenhuma sessão encontrada");
      }

      // Marcar como pronto mesmo sem sessão (pode estar em página pública)
      authReady.value = true;

      // Monitorar mudanças de autenticação
      supabase.auth.onAuthStateChange((event, session) => {
        console.log("🔔 Auth state changed:", event);
        user.value = session?.user || null;

        if (session?.user) {
          console.log("👤 Usuário:", session.user.email);
        }
      });
    } catch (err) {
      console.error("❌ Erro no plugin auth-init:", err);
      authReady.value = true; // Marcar como pronto mesmo com erro
    }
  });
});
