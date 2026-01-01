/**
 * Custom storage adapter para Supabase que combina localStorage e sessionStorage
 * Necessário para melhor compatibilidade em ambiente de produção (Cloudflare, etc)
 */
export class HybridStorageAdapter {
  private prefix = "sb-portaria";

  setItem(key: string, value: string): void {
    try {
      // Armazenar em localStorage para persistência
      const fullKey = `${this.prefix}-${key}`;
      localStorage.setItem(fullKey, value);

      // Também armazenar em sessionStorage como fallback
      sessionStorage.setItem(fullKey, value);
    } catch (error) {
      console.error("❌ Erro ao armazenar no storage:", error);
    }
  }

  getItem(key: string): string | null {
    try {
      const fullKey = `${this.prefix}-${key}`;

      // Tentar localStorage primeiro
      const localValue = localStorage.getItem(fullKey);
      if (localValue) {
        return localValue;
      }

      // Fallback para sessionStorage
      const sessionValue = sessionStorage.getItem(fullKey);
      if (sessionValue) {
        return sessionValue;
      }

      return null;
    } catch (error) {
      console.error("❌ Erro ao ler do storage:", error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      const fullKey = `${this.prefix}-${key}`;
      localStorage.removeItem(fullKey);
      sessionStorage.removeItem(fullKey);
    } catch (error) {
      console.error("❌ Erro ao remover do storage:", error);
    }
  }
}

export const hybridStorage =
  typeof window !== "undefined" ? new HybridStorageAdapter() : null;
