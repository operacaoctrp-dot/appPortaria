export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log("🔑 Middleware guest executado");
  console.log("  📍 De:", from?.path || "inicial");
  console.log("  📍 Para:", to.path);

  // Guest middleware APENAS para rotas públicas de autenticação
  const publicAuthRoutes = ["/login", "/recuperar-senha", "/redefinir-senha", "/"];
  
  if (!publicAuthRoutes.includes(to.path)) {
    console.log("🔓 Rota protegida - ignorando guest middleware:", to.path);
    return; // Não fazer nada em rotas protegidas
  }

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

    // Se user está logado E está em rota pública, redirecionar para home
    if (user.value && to.path !== "/") {
      console.log("✅ Usuário já logado - redirecionando para home");
      return navigateTo("/");
    }

    console.log("🔓 Usuário não logado - permitindo acesso a:", to.path);
  }
});
