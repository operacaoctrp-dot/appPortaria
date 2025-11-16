export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient();
  const user = useState("auth.user");

  console.log("Plugin auth-init: Iniciando");

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      user.value = session.user;
      console.log("Sessao restaurada:", session.user.email);
    }

    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null;
    });
  } catch (err) {
    console.error("Erro no plugin:", err);
  }
});
