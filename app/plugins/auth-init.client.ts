export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient();
  const user = useState("auth.user");

  console.log("🔌 Plugin auth-init: Iniciando...");

  try {
    console.log("🔍 Verificando sessão existente...");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      user.value = session.user;
      console.log("✅ Sessão restaurada:", session.user.email);
      console.log(
        "🔑 Token válido até:",
        new Date(session.expires_at * 1000).toLocaleString()
      );
    } else {
      console.log("❌ Nenhuma sessão encontrada");
    }

    // Monitorar mudanças de autenticação
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 Auth state changed:", event);
      user.value = session?.user || null;

      if (session?.user) {
        console.log("👤 Usuário:", session.user.email);
      }
    });
  } catch (err) {
    console.error("❌ Erro no plugin auth-init:", err);
  }
});
