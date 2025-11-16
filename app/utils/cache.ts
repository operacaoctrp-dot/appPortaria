/**
 * Gerenciador de cache local usando localStorage
 */
export class CacheManager {
  private static instance: CacheManager;

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Definir item no cache com TTL
   */
  set(key: string, data: any, ttl?: number): void {
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttl || 0,
    };

    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error("Erro ao salvar no cache:", error);
    }
  }

  /**
   * Obter item do cache
   */
  get<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);

      // Verificar se expirou
      if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
        this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error("Erro ao ler cache:", error);
      return null;
    }
  }

  /**
   * Remover item do cache
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Erro ao remover do cache:", error);
    }
  }

  /**
   * Limpar todo o cache
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
    }
  }

  /**
   * Verificar se item existe no cache
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

/**
 * Instância singleton do cache
 */
export const cache = CacheManager.getInstance();

/**
 * Wrapper para promises com cache
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Tentar obter do cache primeiro
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Se não estiver em cache, buscar dados
  const data = await fetcher();

  // Salvar no cache
  cache.set(key, data, ttl);

  return data;
}
