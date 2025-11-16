export const APP_CONFIG = {
  name: "Sistema de Portaria",
  version: "2.0.0",
  description: "Sistema de controle de entrada e saída de funcionários",
  author: "Equipe de Desenvolvimento",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  NOVA_ENTRADA: "/novaEntrada",
  DASHBOARD: "/dashboard",
  RELATORIOS: "/relatorios",
  CONFIGURACOES: "/configuracoes",
} as const;

export const STORAGE_KEYS = {
  AUTH_USER: "auth.user",
  AUTH_LOADING: "auth.loading",
  THEME: "app.theme",
  COLABORADORES_CACHE: "colaboradores.cache",
  LAST_UPDATE: "data.lastUpdate",
} as const;

export const API_ENDPOINTS = {
  COLABORADORES: "colaboradores",
  HISTORICO: "colaboradores_historico",
  AUTH: "auth",
} as const;

export const PERMISSIONS = {
  ADMIN: "admin",
  PORTEIRO: "porteiro",
  VISUALIZADOR: "visualizador",
} as const;

export const ROLES_PERMISSIONS = {
  [PERMISSIONS.ADMIN]: [
    "view_dashboard",
    "manage_users",
    "manage_colaboradores",
    "view_reports",
    "export_data",
    "manage_system",
  ],
  [PERMISSIONS.PORTEIRO]: [
    "view_dashboard",
    "manage_colaboradores",
    "view_reports",
  ],
  [PERMISSIONS.VISUALIZADOR]: ["view_dashboard", "view_reports"],
} as const;

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export const CACHE_TTL = {
  COLABORADORES: 5 * 60 * 1000, // 5 minutos
  HISTORICO: 10 * 60 * 1000, // 10 minutos
  USER_SESSION: 24 * 60 * 60 * 1000, // 24 horas
} as const;
