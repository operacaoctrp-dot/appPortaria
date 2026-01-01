/**
 * Aguarda a autenticação estar pronta
 * Útil para garantir que a sessão foi restaurada antes de usar dados autenticados
 */
export const useAuthReady = async () => {
  const supabase = useSupabaseClient();
  let attempts = 0;
  const maxAttempts = 40; // 4 segundos

  while (attempts < maxAttempts) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        return true;
      }
    } catch (err) {
      // Ignorar erro e tentar novamente
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }

  // Se chegou aqui, não conseguiu restaurar a sessão
  console.warn("⚠️ Timeout ao aguardar autenticação");
  return false;
};
