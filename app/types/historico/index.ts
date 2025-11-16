export interface ColaboradorHistorico {
  id: number;
  colaborador_id: number;
  data_registro: string; // YYYY-MM-DD
  nome: string | null;
  funcao: string | null;
  filial: string | null;
  matricula: number | null;
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
  created_at: string;
  updated_at: string;
}

export interface HistoricoFilter {
  colaborador_id?: number;
  data_inicio?: string;
  data_fim?: string;
  nome?: string;
  funcao?: string;
  filial?: string;
}

export interface HistoricoResumo {
  data: string;
  total_entradas: number;
  total_saidas: number;
  funcionarios_unicos: number;
  tempo_medio_permanencia: number;
  pico_movimento: string;
}

export interface MovimentacaoHora {
  hora: number;
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface RelatorioHistorico {
  periodo: {
    inicio: string;
    fim: string;
  };
  resumo: {
    total_dias: number;
    total_funcionarios: number;
    total_movimentacoes: number;
    media_diaria: number;
  };
  dados_diarios: HistoricoResumo[];
  funcionarios_frequentes: {
    nome: string;
    dias_trabalhados: number;
    total_horas: number;
  }[];
}
