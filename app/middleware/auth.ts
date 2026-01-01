export default defineNuxtRouteMiddleware(async (to) => {
  console.log("🛡️ Middleware auth executado para:", to.path);

  if (typeof window === "undefined") {
    // SSR - não verificar aqui
    return;
  }

  try {
    // Aguardar que o plugin auth-init complete a restauração
    const authReady = useState("auth.ready", () => false);
    const user = useState("auth.user");

    // Esperar até 3 segundos pelo plugin auth-init completar
    let waitAttempts = 0;
    while (!authReady.value && waitAttempts < 30) {
      console.log("⏳ Aguardando auth.ready...", waitAttempts + 1);
      await new Promise((resolve) => setTimeout(resolve, 100));
      waitAttempts++;
    }

    console.log("✅ Auth inicializado. user:", user.value?.email || "nenhum");

    if (user.value?.id) {
      console.log("✅ Usuário autenticado:", user.value.email);
      return; // Permitir acesso
    }

    // Sem usuário - redirecionar para login
    console.log("❌ Sem autenticação - redirecionando para login");
    return navigateTo("/login");
  } catch (error) {
    console.error("❌ Erro no middleware auth:", error);
    return navigateTo("/login");
  }
});
