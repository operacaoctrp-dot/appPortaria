export default defineNuxtRouteMiddleware(async (to) => {
  console.log("🛡️ Middleware auth executado para:", to.path);

  if (typeof window === "undefined") {
    // SSR - não verificar aqui
    return;
  }

  try {
    // Aguardar que o plugin auth-init complete a restauração
    const authReady = useState("auth.ready", () => false);
    const user = useState("auth.user", () => null);

    console.log("⏳ Middleware: authReady inicial =", authReady.value);
    console.log(
      "👤 Middleware: user.value inicial =",
      user.value?.email || "null"
    );

    // Se já está pronto, não precisa aguardar
    if (authReady.value) {
      console.log("✅ Auth já pronto, verificando usuário...");
      if (user.value?.id) {
        console.log("✅ Middleware: Usuário autenticado -", user.value.email);
        return; // Permitir acesso
      }
      console.log(
        "❌ Middleware: Sem autenticação - redirecionando para /login"
      );
      return navigateTo("/login");
    }

    // Esperar até 10 segundos pelo plugin auth-init completar
    let waitAttempts = 0;
    const maxWaitAttempts = 100; // 10 segundos com intervalo de 100ms

    while (!authReady.value && waitAttempts < maxWaitAttempts) {
      if (waitAttempts % 10 === 0) {
        // Log a cada 1 segundo
        console.log(
          "⏳ Aguardando auth.ready... tentativa",
          waitAttempts + 1,
          "user:",
          user.value?.email || "null"
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      waitAttempts++;
    }

    console.log(
      "✅ Middleware: Auth inicializado após",
      waitAttempts,
      "tentativas, authReady =",
      authReady.value,
      ", user =",
      user.value?.email || "null"
    );

    if (user.value?.id) {
      console.log("✅ Middleware: Usuário autenticado -", user.value.email);
      return; // Permitir acesso
    }

    // Sem usuário após espera - redirecionar para login
    console.log("❌ Middleware: Sem autenticação - redirecionando para /login");
    return navigateTo("/login");
  } catch (error) {
    console.error("❌ Middleware auth: Erro -", error);
    return navigateTo("/login");
  }
});
