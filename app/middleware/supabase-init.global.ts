export default defineNuxtRouteMiddleware(async () => {
  // Este middleware será executado globalmente em todas as rotas
  // Só executa no cliente - verificação rápida sem bloqueio
  if (typeof window !== "undefined") {
    try {
      const supabase = useSupabaseClient();

      // Verificar se o cliente está disponível
      if (supabase && supabase.auth) {
        console.log("✅ Cliente Supabase disponível");
      }
    } catch (error) {
      console.warn("⚠️ Supabase ainda inicializando...");
    }
  }
});
