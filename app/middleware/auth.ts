export default defineNuxtRouteMiddleware(async (to) => {
  console.log("🛡️ Middleware auth executado para:", to.path);

  if (typeof window !== "undefined") {
    // Verificar se há tokens do Supabase no localStorage
    // Esta é a forma mais confiável de detectar se usuário estava logado
    const hasStoredSession = Object.keys(localStorage).some(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token")
    );

    console.log("🔑 Sessão armazenada encontrada:", hasStoredSession);

    // Se há tokens armazenados, permitir acesso
    // O Supabase restaurará a sessão em segundo plano
    if (hasStoredSession) {
      console.log("✅ Tokens encontrados - permitindo acesso (restaurando sessão...)");
      return;
    }

    // Se não há tokens, tentar uma última verificação rápida
    let supabase;
    try {
      supabase = useSupabaseClient();

      if (supabase && supabase.auth) {
        const { data } = await supabase.auth.getSession();

        if (data.session?.user) {
          console.log("✅ Sessão ativa encontrada");
          return;
        }
      }
    } catch (error) {
      console.warn("⚠️ Erro ao verificar sessão:", error);
    }

    // Sem tokens e sem sessão ativa = redirecionar para login
    console.log("❌ Sem autenticação - redirecionando para login");
    return navigateTo("/login");
  }
});
