import { logger } from "./logger";
import type { AuthError } from "@supabase/supabase-js";

/**
 * Tipos de erros da aplicação
 */
export enum ErrorType {
  AUTH = "auth",
  DATABASE = "database",
  VALIDATION = "validation",
  NETWORK = "network",
  PERMISSION = "permission",
  UNKNOWN = "unknown",
}

/**
 * Interface para erro padronizado
 */
export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  originalError?: any;
  statusCode?: number;
}

/**
 * Mensagens de erro amigáveis para o usuário
 */
const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  // Autenticação
  "Invalid login credentials": "Email ou senha incorretos",
  "Email not confirmed": "Por favor, confirme seu email antes de fazer login",
  "User already registered": "Este email já está cadastrado",
  "Password should be at least 6 characters":
    "A senha deve ter pelo menos 6 caracteres",

  // Banco de dados
  'relation "colaboradores_historico" does not exist':
    "Tabela de histórico não configurada. Entre em contato com o suporte.",
  "duplicate key value": "Este registro já existe no sistema",
  "foreign key violation":
    "Não é possível excluir este registro pois está sendo usado",

  // Rede
  "Failed to fetch":
    "Erro de conexão. Verifique sua internet e tente novamente",
  "Network request failed":
    "Erro de conexão. Verifique sua internet e tente novamente",

  // Permissões
  "new row violates row-level security":
    "Você não tem permissão para realizar esta ação",
  "permission denied": "Você não tem permissão para acessar este recurso",
};

/**
 * Determinar o tipo de erro
 */
function determineErrorType(error: any): ErrorType {
  if (!error) return ErrorType.UNKNOWN;

  const errorMessage = error.message?.toLowerCase() || "";

  // Erros de autenticação
  if (
    error.status === 401 ||
    errorMessage.includes("auth") ||
    errorMessage.includes("login")
  ) {
    return ErrorType.AUTH;
  }

  // Erros de permissão
  if (
    error.status === 403 ||
    errorMessage.includes("permission") ||
    errorMessage.includes("security")
  ) {
    return ErrorType.PERMISSION;
  }

  // Erros de banco de dados
  if (
    error.code?.startsWith("42") ||
    errorMessage.includes("relation") ||
    errorMessage.includes("table")
  ) {
    return ErrorType.DATABASE;
  }

  // Erros de rede
  if (
    error.status === 0 ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("network")
  ) {
    return ErrorType.NETWORK;
  }

  // Erros de validação
  if (
    error.status === 400 ||
    errorMessage.includes("invalid") ||
    errorMessage.includes("validation")
  ) {
    return ErrorType.VALIDATION;
  }

  return ErrorType.UNKNOWN;
}

/**
 * Obter mensagem amigável para o usuário
 */
function getUserFriendlyMessage(error: any): string {
  const errorMessage = error.message || error.error_description || "";

  // Procurar mensagem conhecida
  for (const [key, value] of Object.entries(USER_FRIENDLY_MESSAGES)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  // Mensagens genéricas por tipo
  const type = determineErrorType(error);

  switch (type) {
    case ErrorType.AUTH:
      return "Erro de autenticação. Verifique suas credenciais e tente novamente.";
    case ErrorType.DATABASE:
      return "Erro ao acessar os dados. Tente novamente em alguns instantes.";
    case ErrorType.VALIDATION:
      return "Dados inválidos. Verifique as informações e tente novamente.";
    case ErrorType.NETWORK:
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    case ErrorType.PERMISSION:
      return "Você não tem permissão para realizar esta ação.";
    default:
      return "Ocorreu um erro inesperado. Tente novamente.";
  }
}

/**
 * Processar erro e retornar objeto padronizado
 */
export function handleError(error: any, context?: string): AppError {
  const type = determineErrorType(error);
  const message =
    error.message || error.error_description || "Erro desconhecido";
  const userMessage = getUserFriendlyMessage(error);

  // Log do erro (apenas em desenvolvimento)
  if (context) {
    logger.error(`[${context}] ${type.toUpperCase()} Error:`, message);
  } else {
    logger.error(`${type.toUpperCase()} Error:`, message);
  }

  // Log do stack trace se disponível (apenas em desenvolvimento)
  if (error.stack) {
    logger.debug("Stack trace:", error.stack);
  }

  return {
    type,
    message,
    userMessage,
    originalError: error,
    statusCode: error.status || error.statusCode,
  };
}

/**
 * Tratar erros de autenticação do Supabase
 */
export function handleAuthError(
  error: AuthError | null,
  context?: string
): AppError | null {
  if (!error) return null;

  return handleError(error, context || "Auth");
}

/**
 * Tratar erros de banco de dados do Supabase
 */
export function handleDatabaseError(error: any, context?: string): AppError {
  return handleError(error, context || "Database");
}

/**
 * Verificar se erro é relacionado a tabela não existente
 */
export function isTableNotFoundError(error: any): boolean {
  const message = error?.message?.toLowerCase() || "";
  return error?.code === "42P01" || message.includes("does not exist");
}

/**
 * Verificar se erro é de permissão
 */
export function isPermissionError(error: any): boolean {
  const type = determineErrorType(error);
  return type === ErrorType.PERMISSION;
}

/**
 * Verificar se erro é de rede
 */
export function isNetworkError(error: any): boolean {
  const type = determineErrorType(error);
  return type === ErrorType.NETWORK;
}

/**
 * Extrair mensagem de erro segura para exibir ao usuário
 */
export function getSafeErrorMessage(error: any): string {
  const appError = handleError(error);
  return appError.userMessage;
}

export default {
  handleError,
  handleAuthError,
  handleDatabaseError,
  isTableNotFoundError,
  isPermissionError,
  isNetworkError,
  getSafeErrorMessage,
};
