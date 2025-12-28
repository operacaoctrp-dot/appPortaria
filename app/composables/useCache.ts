/**
 * Sistema de cache simples com TTL (Time To Live)
 * Útil para evitar requisições repetidas ao Supabase
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos padrão

  /**
   * Armazena dados no cache com TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * Busca dados do cache (retorna null se expirado ou não existe)
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache HIT: ${key}`);
    return entry.data as T;
  }

  /**
   * Verifica se uma chave existe e está válida
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove uma chave específica do cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
    console.log("🗑️ Cache limpo");
  }

  /**
   * Remove entradas expiradas (garbage collection)
   */
  cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`🗑️ Cache cleanup: ${removedCount} itens removidos`);
    }
  }

  /**
   * Retorna informações sobre o cache
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      defaultTTL: this.defaultTTL,
    };
  }
}

// Instância global do cache
const cache = new SimpleCache();

// Cleanup automático a cada 10 minutos
if (import.meta.client) {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}

export const useCache = () => cache;
