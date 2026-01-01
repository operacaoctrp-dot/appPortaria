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

      // Se fez login nos últimos 10 segundos, permitir acesso sem verificar
      if (timeSinceLogin < 10000) {
        console.log("✅ Login recente detectado - permitindo acesso");
        sessionStorage.removeItem("justLoggedIn");
        return;
      }
    }

    // Verificar se há tokens do Supabase no localStorage
    const hasStoredSession = Object.keys(localStorage).some(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token")
    );

    // Aguardar um pouco para a sessão ser restaurada do localStorage
    // Isso é necessário porque o Supabase restaura a sessão de forma assíncrona
    let session = null;
    let attempts = 0;
    const maxAttempts = hasStoredSession ? 20 : 3; // Mais tentativas se há token armazenado

    while (attempts < maxAttempts) {
      const { data } = await supabase.auth.getSession();
      session = data.session;

      if (session?.user) {
        console.log("✅ Sessão encontrada na tentativa", attempts + 1);
        break;
      }

      if (!hasStoredSession && attempts >= 2) {
        // Não há sessão armazenada, não precisa continuar tentando
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
