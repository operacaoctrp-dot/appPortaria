import { ref, computed, reactive } from "vue";
import { z, type ZodSchema } from "zod";

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
  firstError?: string;
}

export function useValidation<T extends Record<string, any>>(
  schema: ZodSchema<T>,
  initialData?: Partial<T>
) {
  // Estado do formulário
  const formData = ref<Partial<T>>(initialData || {});
  const errors = ref<Record<string, string[]>>({});
  const touchedFields = ref<Set<string>>(new Set());
  const isSubmitting = ref(false);

  /**
   * Validar dados com schema Zod
   */
  const validateData = (data: Partial<T>): ValidationResult<T> => {
    try {
      const result = schema.safeParse(data);

      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      }

      const validationErrors: Record<string, string[]> = {};

      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!validationErrors[path]) {
          validationErrors[path] = [];
        }
        validationErrors[path].push(issue.message);
      });

      const firstError = Object.values(validationErrors)[0]?.[0];

      return {
        success: false,
        errors: validationErrors,
        firstError,
      };
    } catch (error) {
      return {
        success: false,
        errors: { form: ["Erro de validação interno"] },
        firstError: "Erro de validação interno",
      };
    }
  };

  /**
   * Validar campo específico
   */
  const validateField = (fieldName: string, value: any) => {
    try {
      // Validar apenas se o schema for do tipo object
      if (schema instanceof z.ZodObject) {
        const fieldSchema = schema.shape[fieldName];

        if (fieldSchema) {
          fieldSchema.parse(value);

          // Limpar erros se válido
          const newErrors = { ...errors.value };
          delete newErrors[fieldName];
          errors.value = newErrors;

          return true;
        }
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.issues.map((issue) => issue.message);
        errors.value = {
          ...errors.value,
          [fieldName]: fieldErrors,
        };
        return false;
      }
    }

    return true;
  };

  /**
   * Definir valor de campo
   */
  const setFieldValue = (fieldName: string, value: any) => {
    formData.value = {
      ...formData.value,
      [fieldName]: value,
    };

    // Validar campo em tempo real se já foi tocado
    if (touchedFields.value.has(fieldName)) {
      validateField(fieldName, value);
    }
  };

  /**
   * Marcar campo como tocado
   */
  const touchField = (fieldName: string) => {
    touchedFields.value.add(fieldName);

    // Validar campo quando tocado
    const value = formData.value[fieldName as keyof T];
    validateField(fieldName, value);
  };

  /**
   * Validar formulário completo
   */
  const validate = (): ValidationResult<T> => {
    const result = validateData(formData.value);

    if (!result.success && result.errors) {
      errors.value = result.errors;

      // Marcar todos os campos com erro como tocados
      Object.keys(result.errors).forEach((fieldName) => {
        touchedFields.value.add(fieldName);
      });
    } else {
      errors.value = {};
    }

    return result;
  };

  /**
   * Limpar erros
   */
  const clearErrors = () => {
    errors.value = {};
  };

  /**
   * Limpar formulário
   */
  const reset = (newData?: Partial<T>) => {
    formData.value = newData || {};
    errors.value = {};
    touchedFields.value.clear();
    isSubmitting.value = false;
  };

  /**
   * Obter erros de um campo
   */
  const getFieldErrors = (fieldName: string): string[] => {
    return errors.value[fieldName] || [];
  };

  /**
   * Verificar se campo tem erros
   */
  const hasFieldError = (fieldName: string): boolean => {
    return getFieldErrors(fieldName).length > 0;
  };

  /**
   * Obter primeiro erro de um campo
   */
  const getFirstFieldError = (fieldName: string): string | undefined => {
    return getFieldErrors(fieldName)[0];
  };

  // Computeds
  const isFormValid = computed(() => {
    return (
      Object.keys(errors.value).length === 0 && touchedFields.value.size > 0
    );
  });

  const isFormDirty = computed(() => {
    return Object.keys(formData.value).length > 0;
  });

  const hasFormErrors = computed(() => {
    return Object.keys(errors.value).length > 0;
  });

  return {
    // Estado
    formData,
    errors,
    touchedFields,
    isSubmitting,

    // Computeds
    isFormValid,
    isFormDirty,
    hasFormErrors,

    // Métodos
    validateData,
    validateField,
    setFieldValue,
    touchField,
    validate,
    clearErrors,
    reset,
    getFieldErrors,
    hasFieldError,
    getFirstFieldError,
  };
}
