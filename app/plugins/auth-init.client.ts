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

      // Debug: check localStorage
      const storedSession = localStorage.getItem("sb-portaria-auth.2");
      console.log(
        "💾 Sessão em localStorage?",
        storedSession ? "✅ SIM" : "❌ NÃO"
      );

      // ✅ IMPORTANTE: Usar onAuthStateChange para aguardar a sessão ser restaurada
      // Isso garante que capturamos a sessão assim que o Supabase a restaura
      let sessionRestored = false;
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log(
            "🔔 Auth state changed:",
            event,
            session?.user?.email || "null"
          );
          
          if (session?.user) {
            user.value = session.user;
            console.log("✅ Sessão restaurada via onAuthStateChange:", session.user.email);
            console.log(
              "🔑 Token válido até:",
              new Date((session.expires_at ?? 0) * 1000).toLocaleString()
            );
          } else {
            console.log("📭 Nenhuma sessão encontrada");
            user.value = null;
          }
          
          // Marcar como restaurado após primeiro evento
          if (!sessionRestored) {
            sessionRestored = true;
            authReady.value = true;
            console.log(
              "✅ Plugin auth-init pronto. user.value:",
              user.value?.email || "null"
            );
          }
        }
      );

      // Tentar obter sessão atual também (para caso de hard refresh)
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      console.log(
        "🔐 getSession() retornou:",
        session ? "✅ SESSÃO VÁLIDA" : "❌ SEM SESSÃO"
      );

      if (session?.user && !user.value) {
        user.value = session.user;
        console.log("✅ Sessão restaurada via getSession():", session.user.email);
      }

      // Se não houver listener chamado em tempo hábil, marcar como pronto mesmo assim
      setTimeout(() => {
        if (!sessionRestored) {
          console.log(
            "⏰ Timeout aguardando onAuthStateChange. Marcando como pronto. user.value:",
            user.value?.email || "null"
          );
          sessionRestored = true;
          authReady.value = true;
        }
      }, 1000);

      // Cleanup: unsubscribe quando não for mais necessário
      if (subscription?.unsubscribe) {
        // Manter subscription ativa para futuras mudanças
      }
    } catch (err) {
      console.error("❌ Erro no plugin auth-init:", err);
      authReady.value = true;
      user.value = null;
    }
  };

  // Executar imediatamente - fire and forget
  initAuth();
});
