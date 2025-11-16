import { z } from "zod";

/**
 * Schema para login
 */
export const LoginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Schema para colaborador
 */
export const ColaboradorSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .refine((val) => val.trim().length > 0, "Nome não pode estar vazio"),

  matricula: z
    .number()
    .int("Matrícula deve ser um número inteiro")
    .positive("Matrícula deve ser positiva")
    .optional()
    .nullable(),

  funcao: z
    .string()
    .min(2, "Função deve ter pelo menos 2 caracteres")
    .max(50, "Função deve ter no máximo 50 caracteres")
    .optional()
    .nullable(),

  filial: z
    .string()
    .min(2, "Filial deve ter pelo menos 2 caracteres")
    .max(50, "Filial deve ter no máximo 50 caracteres")
    .optional()
    .nullable(),
});

export type ColaboradorInput = z.infer<typeof ColaboradorSchema>;

/**
 * Schema para entrada de funcionário
 */
export const EntradaFuncionarioSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),

  cargo: z
    .string()
    .min(2, "Cargo deve ter pelo menos 2 caracteres")
    .max(50, "Cargo deve ter no máximo 50 caracteres")
    .optional(),
});

export type EntradaFuncionarioInput = z.infer<typeof EntradaFuncionarioSchema>;

/**
 * Schema para saída de funcionário
 */
export const SaidaFuncionarioSchema = z.object({
  funcionarioId: z
    .number()
    .int("ID deve ser um número inteiro")
    .positive("ID deve ser positivo"),
});

export type SaidaFuncionarioInput = z.infer<typeof SaidaFuncionarioSchema>;

/**
 * Schema para filtros
 */
export const FiltroSchema = z.object({
  nome: z.string().optional(),
  funcao: z.string().optional(),
  filial: z.string().optional(),
  matricula: z.number().int().positive().optional(),
  dataInicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
    .optional(),
  dataFim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
    .optional(),
});

export type FiltroInput = z.infer<typeof FiltroSchema>;

/**
 * Schema para histórico
 */
export const HistoricoSchema = z.object({
  colaborador_id: z.number().int().positive(),
  data_registro: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nome: z.string().max(100).optional().nullable(),
  funcao: z.string().max(50).optional().nullable(),
  filial: z.string().max(50).optional().nullable(),
  matricula: z.number().int().positive().optional().nullable(),
  ent1: z.string().optional().nullable(),
  sai1: z.string().optional().nullable(),
  ent2: z.string().optional().nullable(),
  sai2: z.string().optional().nullable(),
  ent3: z.string().optional().nullable(),
  sai3: z.string().optional().nullable(),
  ent4: z.string().optional().nullable(),
  sai4: z.string().optional().nullable(),
  ent5: z.string().optional().nullable(),
  sai5: z.string().optional().nullable(),
});

export type HistoricoInput = z.infer<typeof HistoricoSchema>;

/**
 * Função utilitária para validar dados
 */
export const validarDados = <T>(
  schema: z.ZodSchema<T>,
  dados: unknown
): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.safeParse(dados);

    if (result.success) {
      return { success: true, data: result.data };
    }

    const errors = result.error.issues.map((issue) => issue.message);
    return { success: false, errors };
  } catch (error) {
    return { success: false, errors: ["Erro de validação interno"] };
  }
};
