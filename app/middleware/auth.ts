export default defineNuxtRouteMiddleware(async (to) => {
  console.log("🛡️ Middleware auth executado para:", to.path);

  if (typeof window !== "undefined") {
    const supabase = useSupabaseClient();

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

    // Verificar sessão antes de decidir redirecionar
    const {
      data: { session },
    } = await supabase.auth.getSession();

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
