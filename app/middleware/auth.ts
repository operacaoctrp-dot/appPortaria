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

    // Esperar até 5 segundos pelo plugin auth-init completar
    let waitAttempts = 0;
    const maxWaitAttempts = 50; // 5 segundos com intervalo de 100ms

    while (!authReady.value && waitAttempts < maxWaitAttempts) {
      console.log("⏳ Aguardando auth.ready... tentativa", waitAttempts + 1);
      await new Promise((resolve) => setTimeout(resolve, 100));
      waitAttempts++;
    }

    console.log(
      "✅ Middleware: Auth inicializado após",
      waitAttempts,
      "tentativas"
    );
    console.log("👤 Middleware: user.value =", user.value?.email || "null");

    if (user.value?.id) {
      console.log("✅ Middleware: Usuário autenticado -", user.value.email);
      return; // Permitir acesso
    }

    // Sem usuário - redirecionar para login
    console.log("❌ Middleware: Sem autenticação - redirecionando para /login");
    return navigateTo("/login");
  } catch (error) {
    console.error("❌ Middleware auth: Erro -", error);
    return navigateTo("/login");
  }
});
