export default defineNuxtRouteMiddleware(async (to) => {
  console.log("🛡️ Middleware auth executado para:", to.path);

  if (typeof window === "undefined") {
    // SSR - não verificar aqui
    return;
  }

  // Aguardar que o Supabase restaure a sessão (max 2 segundos)
  let session = null;
  let attempts = 0;
  
  try {
    const supabase = useSupabaseClient();

    if (!supabase || !supabase.auth) {
      console.warn("⚠️ Cliente Supabase não disponível");
      return;
    }

    // Tentar obter sessão com múltiplas tentativas
    // Importante: dar tempo para o Supabase restaurar do storage
    while (attempts < 20) {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn("⚠️ Erro ao obter sessão:", error.message);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }

      session = data.session;
      
      if (session?.user) {
        console.log("✅ Sessão encontrada na tentativa", attempts + 1);
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (session?.user) {
      console.log("✅ Usuário autenticado:", session.user.email);
      return;
    }

    // Sem sessão - redirecionar para login
    console.log("❌ Sem autenticação após", attempts, "tentativas - redirecionando para login");
    return navigateTo("/login");

  } catch (error) {
    console.error("❌ Erro no middleware auth:", error);
    // Em caso de erro, redirecionar para login para segurança
    return navigateTo("/login");
  }
});
