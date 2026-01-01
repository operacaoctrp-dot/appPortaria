export default defineNuxtRouteMiddleware(async (to) => {
  console.log("🛡️ Middleware auth executado para:", to.path);

  if (typeof window !== "undefined") {
    let supabase;

    try {
      supabase = useSupabaseClient();

      // Verificar se o cliente Supabase está disponível
      if (!supabase || !supabase.auth) {
        console.warn("⚠️ Cliente Supabase não disponível - aguardando...");
        return;
      }
    } catch (error) {
      console.warn("⚠️ Erro ao obter cliente Supabase:", error);
      return;
    }

    // Verificar se acabou de fazer login
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");
    const loginTimestamp = sessionStorage.getItem("loginTimestamp");

    if (justLoggedIn && loginTimestamp) {
      const timeSinceLogin = Date.now() - parseInt(loginTimestamp);

      // Se fez login nos últimos 30 segundos, permitir acesso sem verificar
      if (timeSinceLogin < 30000) {
        console.log("✅ Login recente detectado - permitindo acesso");
        sessionStorage.removeItem("justLoggedIn");
        return;
      }
    }

    // Verificar se há tokens do Supabase no localStorage
    const hasStoredSession = Object.keys(localStorage).some(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token")
    );

    console.log("🔑 Tokens armazenados encontrados:", hasStoredSession);

    // Aguardar um pouco para a sessão ser restaurada do localStorage
    let session = null;
    let attempts = 0;
    // Em produção, aguardar mais tempo. Detectar se é produção checando se não é localhost
    const isProduction =
      typeof location !== "undefined" &&
      !location.hostname.includes("localhost") &&
      !location.hostname.includes("127.0.0.1");

    const maxAttempts =
      isProduction && hasStoredSession ? 30 : hasStoredSession ? 20 : 3;

    console.log(
      "⏳ Tentativas máximas:",
      maxAttempts,
      "| Produção:",
      isProduction
    );

    while (attempts < maxAttempts) {
      try {
        const { data } = await supabase.auth.getSession();
        session = data.session;

        if (session?.user) {
          console.log("✅ Sessão encontrada na tentativa", attempts + 1);
          break;
        }
      } catch (err) {
        console.warn("⚠️ Erro ao obter sessão:", err);
      }

      // Se não há tokens armazenados, não precisa continuar tentando
      if (!hasStoredSession && attempts >= 2) {
        console.log("📭 Nenhuma sessão armazenada encontrada");
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    console.log(
      "👤 Estado da sessão no middleware:",
      session?.user ? "Logado" : "Não logado"
    );

    if (!session?.user) {
      console.log("❌ Usuário não autenticado - redirecionando para login");
      return navigateTo("/login");
    }

    console.log("✅ Usuário autenticado - permitindo acesso");
  }
});
