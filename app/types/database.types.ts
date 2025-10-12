export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      colaboradores: {
        Row: {
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
        };
        Insert: {
          id?: number;
          created_at?: string;
          matricula?: number | null;
          nome?: string | null;
          funcao?: string | null;
          filial?: string | null;
          ent1?: string | null;
          sai1?: string | null;
          ent2?: string | null;
          sai2?: string | null;
          ent3?: string | null;
          sai3?: string | null;
          ent4?: string | null;
          sai4?: string | null;
          ent5?: string | null;
          sai5?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          matricula?: number | null;
          nome?: string | null;
          funcao?: string | null;
          filial?: string | null;
          ent1?: string | null;
          sai1?: string | null;
          ent2?: string | null;
          sai2?: string | null;
          ent3?: string | null;
          sai3?: string | null;
          ent4?: string | null;
          sai4?: string | null;
          ent5?: string | null;
          sai5?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
