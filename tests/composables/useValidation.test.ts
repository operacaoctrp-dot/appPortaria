import { describe, it, expect, beforeEach } from "vitest";
import { useValidation } from "~/composables/useValidation";
import { z } from "zod";

// Schema de teste
const testSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  age: z.number().min(18, "Idade deve ser pelo menos 18"),
});

type TestData = z.infer<typeof testSchema>;

describe("useValidation", () => {
  it("deve validar dados corretos", () => {
    const { validateData } = useValidation<TestData>(testSchema);

    const validData = {
      email: "test@example.com",
      name: "João Silva",
      age: 25,
    };

    const result = validateData(validData);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validData);
    expect(result.errors).toBeUndefined();
  });

  it("deve retornar erros para dados inválidos", () => {
    const { validateData } = useValidation<TestData>(testSchema);

    const invalidData = {
      email: "email-inválido",
      name: "A",
      age: 16,
    };

    const result = validateData(invalidData);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.email).toContain("Email inválido");
    expect(result.errors?.name).toContain(
      "Nome deve ter pelo menos 2 caracteres"
    );
    expect(result.errors?.age).toContain("Idade deve ser pelo menos 18");
  });

  it("deve gerenciar estado do formulário corretamente", () => {
    const { formData, setFieldValue, touchField, getFieldErrors, isFormValid } =
      useValidation<TestData>(testSchema);

    // Estado inicial
    expect(isFormValid.value).toBe(false);

    // Definir valor válido
    setFieldValue("email", "test@example.com");
    expect(formData.value.email).toBe("test@example.com");

    // Tocar campo com valor inválido
    setFieldValue("email", "invalid-email");
    touchField("email");

    expect(getFieldErrors("email").length).toBeGreaterThan(0);
    expect(getFieldErrors("email")).toContain("Email inválido");
  });

  it("deve limpar erros quando corrigido", () => {
    const { setFieldValue, touchField, getFieldErrors, clearErrors } =
      useValidation<TestData>(testSchema);

    // Definir valor inválido e tocar
    setFieldValue("email", "invalid");
    touchField("email");

    expect(getFieldErrors("email").length).toBeGreaterThan(0);

    // Limpar erros
    clearErrors();
    expect(getFieldErrors("email").length).toBe(0);
  });

  it("deve resetar formulário corretamente", () => {
    const { formData, setFieldValue, touchField, reset, touchedFields } =
      useValidation<TestData>(testSchema);

    // Preencher formulário
    setFieldValue("email", "test@example.com");
    setFieldValue("name", "João");
    touchField("email");

    expect(Object.keys(formData.value).length).toBeGreaterThan(0);
    expect(touchedFields.value.size).toBeGreaterThan(0);

    // Reset
    reset();

    expect(Object.keys(formData.value).length).toBe(0);
    expect(touchedFields.value.size).toBe(0);
  });

  it("deve permitir reset com novos dados", () => {
    const { formData, reset } = useValidation<TestData>(testSchema);

    const newData = {
      email: "new@example.com",
      name: "Maria Silva",
    };

    reset(newData);

    expect(formData.value).toEqual(newData);
  });
});
