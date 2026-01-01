export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log("🔑 Middleware guest executado");
  console.log("  📍 De:", from?.path || "inicial");
  console.log("  📍 Para:", to.path);

  if (typeof window !== "undefined") {
    // Aguardar que o plugin auth-init complete a restauração
    const authReady = useState("auth.ready", () => false);
    const user = useState("auth.user", () => null);

    // Esperar até 2 segundos para auth estar pronto
    let waitAttempts = 0;
    while (!authReady.value && waitAttempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      waitAttempts++;
    }

    console.log(
      "👤 Estado do usuário no guest middleware:",
      user.value ? "Logado" : "Não logado"
    );

    if (user.value) {
      console.log("✅ Usuário já logado - redirecionando para home");
      return navigateTo("/");
    }

    console.log("🔓 Usuário não logado - permitindo acesso a:", to.path);
  }
});
