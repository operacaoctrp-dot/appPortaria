/**
 * Plugin para restaurar a sessão do Supabase em background
 * Não bloqueia - apenas restaura de forma assíncrona
 */
export default defineNuxtPlugin(() => {
  console.log("🔐 Plugin session-restore: Iniciando...");

  if (process.client) {
    // Restaurar sessão de forma não-bloqueante em background
    const restoreSession = async () => {
      try {
        const supabase = useSupabaseClient();

        if (supabase && supabase.auth) {
          console.log("🔄 Restaurando sessão do Supabase...");
          const { data } = await supabase.auth.getSession();

          if (data.session) {
            console.log("✅ Sessão restaurada:", data.session.user?.email);
          } else {
            console.log("📭 Nenhuma sessão para restaurar");
          }
        }
      } catch (err) {
        console.error("❌ Erro ao restaurar sessão:", err);
      }
    };

    // Chamar sem aguardar (fire and forget)
    restoreSession();
  }
});
