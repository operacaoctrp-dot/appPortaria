import { format, parseISO, isValid, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formatar data para exibição
 */
export const formatarData = (
  data: string | Date,
  formato: string = "dd/MM/yyyy"
): string => {
  try {
    const dataObj = typeof data === "string" ? parseISO(data) : data;
    if (!isValid(dataObj)) return "Data inválida";
    return format(dataObj, formato, { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

/**
 * Formatar horário para exibição
 */
export const formatarHora = (hora: string | Date): string => {
  try {
    const horaObj = typeof hora === "string" ? parseISO(hora) : hora;
    if (!isValid(horaObj)) return "Hora inválida";
    return format(horaObj, "HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar hora:", error);
    return "Hora inválida";
  }
};

/**
 * Formatar data e hora para exibição
 */
export const formatarDataHora = (dataHora: string | Date): string => {
  try {
    const dataHoraObj =
      typeof dataHora === "string" ? parseISO(dataHora) : dataHora;
    if (!isValid(dataHoraObj)) return "Data/Hora inválida";
    return format(dataHoraObj, "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data/hora:", error);
    return "Data/Hora inválida";
  }
};

/**
 * Obter data atual no formato ISO (YYYY-MM-DD)
 */
export const obterDataAtual = (): string => {
  return format(new Date(), "yyyy-MM-dd");
};

/**
 * Obter início e fim do dia para uma data
 */
export const obterLimitesData = (data: string | Date) => {
  const dataObj = typeof data === "string" ? parseISO(data) : data;
  return {
    inicio: startOfDay(dataObj),
    fim: endOfDay(dataObj),
  };
};

/**
 * Calcular diferença em horas entre duas datas
 */
export const calcularDiferencaHoras = (
  inicio: string | Date,
  fim: string | Date
): number => {
  try {
    const inicioObj = typeof inicio === "string" ? parseISO(inicio) : inicio;
    const fimObj = typeof fim === "string" ? parseISO(fim) : fim;

    if (!isValid(inicioObj) || !isValid(fimObj)) return 0;

    const diffMs = fimObj.getTime() - inicioObj.getTime();
    return diffMs / (1000 * 60 * 60); // Converter para horas
  } catch (error) {
    console.error("Erro ao calcular diferença:", error);
    return 0;
  }
};

/**
 * Validar se uma data está no formato correto
 */
export const validarFormatoData = (data: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(data)) return false;

  const dataObj = parseISO(data);
  return isValid(dataObj);
};
