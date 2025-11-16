import { debounce } from "lodash-es";

/**
 * Validar email
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Capitalizar primeira letra
 */
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalizar todas as palavras
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Gerar ID único
 */
export const gerarId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Sanitizar string removendo caracteres especiais
 */
export const sanitizar = (str: string): string => {
  if (!str) return "";
  return str.replace(/[<>\"']/g, "");
};

/**
 * Debounce função (evita execução excessiva)
 */
export const criarDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): T => {
  return debounce(func, delay) as T;
};

/**
 * Formatar número de telefone
 */
export const formatarTelefone = (telefone: string): string => {
  const numbers = telefone.replace(/\D/g, "");

  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
      6
    )}`;
  } else if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7
    )}`;
  }

  return telefone;
};

/**
 * Truncar texto
 */
export const truncarTexto = (texto: string, limite: number = 50): string => {
  if (!texto || texto.length <= limite) return texto;
  return texto.substring(0, limite) + "...";
};

/**
 * Converter para slug (URL amigável)
 */
export const criarSlug = (texto: string): string => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9 -]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-"); // Remove hífens duplicados
};

/**
 * Validar CPF (básico)
 */
export const validarCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, "");

  if (numbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numbers)) return false; // Todos iguais

  // Validação matemática básica
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }

  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(numbers.charAt(10));
};

/**
 * Copiar texto para clipboard
 */
export const copiarParaClipboard = async (texto: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (error) {
    console.error("Erro ao copiar para clipboard:", error);
    return false;
  }
};
