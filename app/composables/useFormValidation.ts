import { ref } from "vue";
import { z, type ZodSchema } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

export const useFormValidation = <T extends ZodSchema>(schema: T) => {
  const errors = ref<Record<string, string>>({});
  const isValidating = ref(false);

  /**
   * Validar todos os campos
   */
  const validate = async (data: unknown): Promise<boolean> => {
    isValidating.value = true;
    errors.value = {};

    try {
      await schema.parseAsync(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const field = err.path.join(".");
          errors.value[field] = err.message;
        });
      }
      return false;
    } finally {
      isValidating.value = false;
    }
  };

  /**
   * Validar um campo específico
   */
  const validateField = async (
    fieldName: string,
    value: unknown
  ): Promise<boolean> => {
    try {
      // Tentar extrair o schema do campo específico
      const fieldSchema = (schema as any).shape?.[fieldName];

      if (!fieldSchema) {
        return true; // Se não houver schema para o campo, considera válido
      }

      await fieldSchema.parseAsync(value);

      // Limpar erro do campo se validação passou
      if (errors.value[fieldName]) {
        delete errors.value[fieldName];
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.value[fieldName] = error.errors[0]?.message || "Campo inválido";
      }
      return false;
    }
  };

  /**
   * Limpar todos os erros
   */
  const clearErrors = () => {
    errors.value = {};
  };

  /**
   * Limpar erro de um campo específico
   */
  const clearFieldError = (fieldName: string) => {
    if (errors.value[fieldName]) {
      delete errors.value[fieldName];
    }
  };

  /**
   * Definir erro manualmente
   */
  const setError = (fieldName: string, message: string) => {
    errors.value[fieldName] = message;
  };

  /**
   * Verificar se há erros
   */
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  /**
   * Obter erro de um campo específico
   */
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.value[fieldName];
  };

  return {
    errors,
    isValidating,
    hasErrors,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setError,
    getFieldError,
  };
};
