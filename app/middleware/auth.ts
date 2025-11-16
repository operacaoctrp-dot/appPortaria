export default defineNuxtRouteMiddleware(async (to) => {
  console.log("🛡️ Middleware auth executado para:", to.path);

  if (process.client) {
    const supabase = useSupabaseClient();

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
