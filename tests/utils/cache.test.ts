import { describe, it, expect, vi } from "vitest";
import { cache } from "~/utils/cache";

describe("utils/cache", () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve armazenar e recuperar dados", () => {
    const testData = { name: "João", age: 30 };

    cache.set("user", testData);
    const retrieved = cache.get("user");

    expect(retrieved).toEqual(testData);
  });

  it("deve verificar se item existe", () => {
    const testData = { test: "data" };

    expect(cache.has("nonexistent")).toBe(false);

    cache.set("existing", testData);
    expect(cache.has("existing")).toBe(true);
  });

  it("deve remover item", () => {
    cache.set("toRemove", "data");
    expect(cache.has("toRemove")).toBe(true);

    cache.remove("toRemove");
    expect(cache.has("toRemove")).toBe(false);
  });

  it("deve limpar todo o cache", () => {
    cache.set("item1", "data1");
    cache.set("item2", "data2");

    cache.clear();

    expect(cache.has("item1")).toBe(false);
    expect(cache.has("item2")).toBe(false);
  });

  it("deve retornar null para item inexistente", () => {
    const result = cache.get("nonexistent");
    expect(result).toBe(null);
  });

  it("deve respeitar TTL e expirar items", async () => {
    const shortTTL = 100; // 100ms

    cache.set("expiring", "data", shortTTL);
    expect(cache.get("expiring")).toBe("data");

    // Aguardar expiração
    await new Promise((resolve) => setTimeout(resolve, shortTTL + 50));

    expect(cache.get("expiring")).toBe(null);
  });
});
