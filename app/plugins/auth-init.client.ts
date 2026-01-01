export default defineNuxtPlugin(async () => {
  const user = useState("auth.user", () => null);
  const authReady = useState("auth.ready", () => false);

  console.log("🔌 Plugin auth-init: Iniciando...");

  const supabase = useSupabaseClient();
  if (!supabase || !supabase.auth) {
    console.warn("⚠️ Supabase não disponível");
    authReady.value = true;
    return;
  }

  // 1️⃣ RESTAURAR SESSÃO IMEDIATAMENTE (síncrono quando possível)
  try {
    console.log("📋 Restaurando sessão da localStorage...");
    const { data, error } = await supabase.auth.getSession();
    
    if (data?.session?.user) {
      user.value = data.session.user;
      console.log("✅ Sessão restaurada:", data.session.user.email);
    } else {
      console.log("❌ Nenhuma sessão encontrada");
      user.value = null;
    }
  } catch (err) {
    console.error("❌ Erro ao restaurar sessão:", err);
    user.value = null;
  }

  // 2️⃣ CONFIGURAR LISTENER para futuras mudanças
  console.log("📌 Configurando listener de autenticação...");
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("🔔 Auth state changed:", event, session?.user?.email || "null");

    if (session?.user) {
      user.value = session.user;
      console.log("✅ Usuário atualizado:", session.user.email);
    } else {
      user.value = null;
      console.log("❌ Usuário limpo");
    }

    authReady.value = true;
    console.log("✅✅✅ AUTHREADY = TRUE");
  });

  // 3️⃣ MARCAR COMO PRONTO
  authReady.value = true;
  console.log("✅ Plugin auth-init: Pronto");
});
