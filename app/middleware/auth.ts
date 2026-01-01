export default defineNuxtRouteMiddleware(async (to) => {
  console.log("🛡️ Middleware auth executado para:", to.path);

  if (typeof window === "undefined") {
    // SSR - não verificar aqui
    return;
  }

  try {
    const supabase = useSupabaseClient();

    if (!supabase || !supabase.auth) {
      console.warn("⚠️ Cliente Supabase não disponível");
      return navigateTo("/login");
    }

    // Dar um tempo mínimo para o Supabase restaurar a sessão (100ms inicial)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Tentar obter sessão com múltiplas tentativas (máximo 3 segundos)
    let session = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const { data } = await supabase.auth.getSession();
      session = data.session;

      if (session?.user) {
        console.log("✅ Sessão encontrada na tentativa", attempts + 1);
        return; // Permitir acesso
      }

      attempts++;
      // Aguardar 100ms antes da próxima tentativa
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Sem sessão após 3 segundos - redirecionar para login
    console.log(
      "❌ Sem autenticação após",
      attempts,
      "tentativas - redirecionando para login"
    );
    return navigateTo("/login");
  } catch (error) {
    console.error("❌ Erro no middleware auth:", error);
    // Em caso de erro, redirecionar para login para segurança
    return navigateTo("/login");
  }
});
