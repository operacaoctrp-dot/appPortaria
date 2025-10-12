export interface Colaborador {
  id: number;
  created_at: string;
  matricula: number | null;
  nome: string | null;
  funcao: string | null;
  filial: string | null;
  ent1: string | null;
  sai1: string | null;
  ent2: string | null;
  sai2: string | null;
  ent3: string | null;
  sai3: string | null;
  ent4: string | null;
  sai4: string | null;
  ent5: string | null;
  sai5: string | null;
}

export interface ColaboradorInput {
  matricula?: number;
  nome?: string;
  funcao?: string;
  filial?: string;
}

export interface ColaboradorFilter {
  matricula?: number;
  nome?: string;
  funcao?: string;
  filial?: string;
}
