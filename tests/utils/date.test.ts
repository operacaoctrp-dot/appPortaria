import { describe, it, expect } from "vitest";
import {
  formatarData,
  formatarHora,
  calcularDiferencaHoras,
} from "~/utils/date";

describe("utils/date", () => {
  describe("formatarData", () => {
    it("deve formatar data corretamente", () => {
      const data = "2024-03-15";
      const resultado = formatarData(data);
      expect(resultado).toBe("15/03/2024");
    });

    it("deve retornar erro para data inválida", () => {
      const dataInvalida = "data-invalida";
      const resultado = formatarData(dataInvalida);
      expect(resultado).toBe("Data inválida");
    });

    it("deve aceitar formato personalizado", () => {
      const data = "2024-03-15";
      const resultado = formatarData(data, "yyyy-MM-dd");
      expect(resultado).toBe("2024-03-15");
    });
  });

  describe("formatarHora", () => {
    it("deve formatar hora corretamente", () => {
      const hora = "2024-03-15T14:30:00Z";
      const resultado = formatarHora(hora);
      // Pode variar com timezone, então vamos verificar o formato
      expect(resultado).toMatch(/^\d{2}:\d{2}$/);
    });

    it("deve retornar erro para hora inválida", () => {
      const horaInvalida = "hora-invalida";
      const resultado = formatarHora(horaInvalida);
      expect(resultado).toBe("Hora inválida");
    });
  });

  describe("calcularDiferencaHoras", () => {
    it("deve calcular diferença em horas", () => {
      const inicio = "2024-03-15T08:00:00Z";
      const fim = "2024-03-15T17:00:00Z";
      const diferenca = calcularDiferencaHoras(inicio, fim);
      expect(diferenca).toBe(9);
    });

    it("deve retornar 0 para datas inválidas", () => {
      const diferenca = calcularDiferencaHoras("invalid", "invalid");
      expect(diferenca).toBe(0);
    });
  });
});
