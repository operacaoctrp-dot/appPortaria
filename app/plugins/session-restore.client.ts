/**
 * Plugin para garantir que a sessão do Supabase está restaurada antes de qualquer navegação
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  console.log("🔐 Plugin session-restore: Iniciando...");

  const authReady = useState("auth.ready", () => false);

  // Aguardar o app ser montado
  if (process.client) {
    await new Promise((resolve) => {
      const timer = setTimeout(() => {
        console.warn("⚠️ Timeout aguardando app:mounted");
        resolve(true);
      }, 5000);

      nuxtApp.hook("app:mounted", () => {
        clearTimeout(timer);
        resolve(true);
      });
    });
  }

  // Tentar restaurar a sessão
  try {
    const supabase = useSupabaseClient();

    if (supabase && supabase.auth) {
      console.log("🔄 Restaurando sessão do Supabase...");

      // Força a restauração da sessão
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Erro ao restaurar sessão:", error);
      } else if (data.session) {
        console.log("✅ Sessão restaurada com sucesso:", data.session.user?.email);
      } else {
        console.log("📭 Nenhuma sessão para restaurar");
      }

      authReady.value = true;
    }
  } catch (err) {
    console.error("❌ Erro no plugin session-restore:", err);
    authReady.value = true;
  }
});
