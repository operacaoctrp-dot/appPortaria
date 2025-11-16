/**
 * Sistema de logging configurável
 * Em produção, apenas erros são logados
 * Em desenvolvimento, todos os logs são exibidos
 */

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

interface LoggerConfig {
  isDevelopment: boolean;
  enableConsole: boolean;
  logLevel: LogLevel[];
}

class Logger {
  private config: LoggerConfig;

  constructor() {
    this.config = {
      isDevelopment: process.env.NODE_ENV === "development",
      enableConsole: true,
      logLevel: ["log", "info", "warn", "error", "debug"],
    };
  }

  /**
   * Log genérico - apenas em desenvolvimento
   */
  log(...args: any[]): void {
    if (this.config.isDevelopment && this.config.enableConsole) {
      console.log(...args);
    }
  }

  /**
   * Log de informação - apenas em desenvolvimento
   */
  info(...args: any[]): void {
    if (this.config.isDevelopment && this.config.enableConsole) {
      console.info(...args);
    }
  }

  /**
   * Log de warning - sempre exibido
   */
  warn(...args: any[]): void {
    if (this.config.enableConsole) {
      console.warn(...args);
    }
  }

  /**
   * Log de erro - sempre exibido
   */
  error(...args: any[]): void {
    if (this.config.enableConsole) {
      console.error(...args);
    }
  }

  /**
   * Log de debug - apenas em desenvolvimento
   */
  debug(...args: any[]): void {
    if (this.config.isDevelopment && this.config.enableConsole) {
      console.debug(...args);
    }
  }

  /**
   * Log de sucesso - apenas em desenvolvimento
   */
  success(message: string, ...args: any[]): void {
    if (this.config.isDevelopment && this.config.enableConsole) {
      console.log(`✅ ${message}`, ...args);
    }
  }

  /**
   * Desabilitar console temporariamente
   */
  disable(): void {
    this.config.enableConsole = false;
  }

  /**
   * Habilitar console
   */
  enable(): void {
    this.config.enableConsole = true;
  }
}

// Exportar instância singleton
export const logger = new Logger();

// Exportar para uso como substituto direto do console
export default logger;
