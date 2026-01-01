export default defineNuxtPlugin(() => {
  const user = useState("auth.user", () => null);
  const authReady = useState("auth.ready", () => false);

  console.log("🔌 Plugin auth-init: Iniciando...");

  // Setup listener IMEDIATAMENTE
  let listenerSetup = false;
  
  const setupAuthListener = () => {
    if (listenerSetup) return;
    listenerSetup = true;
    
    try {
      const supabase = useSupabaseClient();
      if (!supabase || !supabase.auth) {
        console.warn("⚠️ Supabase não disponível para listener");
        authReady.value = true;
        return;
      }

      console.log("📌 Configurando listener de autenticação...");

      supabase.auth.onAuthStateChange((event, session) => {
        console.log("🔔 Auth state changed:", event, session?.user?.email || "null");
        
        if (session?.user) {
          user.value = session.user;
          console.log("✅ Usuário setado:", session.user.email);
        } else {
          user.value = null;
          console.log("❌ Usuário limpo");
        }

        // Marcar como pronto no primeiro evento
        authReady.value = true;
        console.log("✅✅✅ AUTHREADY = TRUE");
      });
    } catch (err) {
      console.error("❌ Erro ao setup listener:", err);
      authReady.value = true;
    }
  };

  // Setup imediatamente se possível
  setupAuthListener();

  // Fallback: tentar setup novamente em 100ms se não conseguiu
  setTimeout(() => {
    if (!listenerSetup) {
      console.log("🔄 Tentando setup listener novamente...");
      setupAuthListener();
    }
  }, 100);

  // Timeout final: marcar como pronto mesmo sem listener
  setTimeout(() => {
    if (!authReady.value) {
      console.log("⏰ Timeout: marcando authReady = true");
      authReady.value = true;
    }
  }, 5000);
});
