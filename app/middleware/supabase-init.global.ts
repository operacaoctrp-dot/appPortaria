export default defineNuxtRouteMiddleware(async () => {
  // Este middleware será executado globalmente em todas as rotas
  // Só executa no cliente
  if (typeof window !== "undefined") {
    // Aguardar até que o Supabase esteja inicializado
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos no máximo

    while (attempts < maxAttempts) {
      try {
        const supabase = useSupabaseClient();

        // Verificar se o cliente está disponível e tem a propriedade auth
        if (
          supabase &&
          typeof supabase === "object" &&
          "auth" in supabase &&
          supabase.auth
        ) {
          console.log("✅ Cliente Supabase inicializado com sucesso");
          break;
        }
      } catch (error) {
        // Silenciar erro durante inicialização
      }

      console.log(
        `⏳ Aguardando inicialização do Supabase... (${
          attempts + 1
        }/${maxAttempts})`
      );

      // Esperar 100ms antes da próxima tentativa
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.error("❌ Timeout: Cliente Supabase não foi inicializado");
      // Recarregar a página uma vez para tentar novamente
      if (!sessionStorage.getItem("supabase_reload_attempted")) {
        sessionStorage.setItem("supabase_reload_attempted", "true");
        window.location.reload();
      }
    } else {
      // Limpar flag de tentativa de reload se deu certo
      sessionStorage.removeItem("supabase_reload_attempted");
    }
  }
});
