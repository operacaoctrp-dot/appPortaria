-- ============================================
-- TABELA DE HISTÓRICO DE ENTRADA/SAÍDA
-- ============================================
-- Esta tabela armazena o histórico diário de entrada/saída de colaboradores
-- Permite consultar dados de qualquer dia passado
-- Um colaborador pode ter apenas um registro por dia

-- Criar tabela de histórico
CREATE TABLE IF NOT EXISTS colaboradores_historico (
  id BIGSERIAL PRIMARY KEY,
  colaborador_id BIGINT NOT NULL,
  data_registro DATE NOT NULL,
  
  -- Campos de cadastro (snapshot do dia para auditoria)
  nome VARCHAR,
  funcao VARCHAR,
  filial VARCHAR,
  matricula VARCHAR,
  
  -- Campos de entrada/saída (até 5 movimentações por dia)
  ent1 TIMESTAMPTZ,
  sai1 TIMESTAMPTZ,
  ent2 TIMESTAMPTZ,
  sai2 TIMESTAMPTZ,
  ent3 TIMESTAMPTZ,
  sai3 TIMESTAMPTZ,
  ent4 TIMESTAMPTZ,
  sai4 TIMESTAMPTZ,
  ent5 TIMESTAMPTZ,
  sai5 TIMESTAMPTZ,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Restrições
  CONSTRAINT fk_colaborador 
    FOREIGN KEY (colaborador_id) 
    REFERENCES colaboradores(id) 
    ON DELETE CASCADE,
  
  -- Um colaborador só pode ter um registro por dia
  CONSTRAINT unique_colaborador_data 
    UNIQUE (colaborador_id, data_registro)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índice para buscar por colaborador
CREATE INDEX IF NOT EXISTS idx_historico_colaborador 
  ON colaboradores_historico(colaborador_id);

-- Índice para buscar por data
CREATE INDEX IF NOT EXISTS idx_historico_data 
  ON colaboradores_historico(data_registro);

-- Índice composto para buscar colaborador + data (consulta mais comum)
CREATE INDEX IF NOT EXISTS idx_historico_colaborador_data 
  ON colaboradores_historico(colaborador_id, data_registro);

-- Índice para buscar por nome (útil para pesquisas)
CREATE INDEX IF NOT EXISTS idx_historico_nome 
  ON colaboradores_historico(nome);

-- ============================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================

-- Habilitar RLS
ALTER TABLE colaboradores_historico ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Permitir leitura de histórico" ON colaboradores_historico;
DROP POLICY IF EXISTS "Permitir escrita de histórico" ON colaboradores_historico;

-- Permitir leitura para usuários autenticados
CREATE POLICY "Permitir leitura de histórico"
  ON colaboradores_historico
  FOR SELECT
  TO authenticated
  USING (true);

-- Permitir inserção/atualização para usuários autenticados
CREATE POLICY "Permitir escrita de histórico"
  ON colaboradores_historico
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- ============================================

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_historico_updated_at ON colaboradores_historico;
CREATE TRIGGER update_historico_updated_at
  BEFORE UPDATE ON colaboradores_historico
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMENTÁRIOS NA TABELA
-- ============================================

COMMENT ON TABLE colaboradores_historico IS 'Histórico diário de entrada/saída dos colaboradores';
COMMENT ON COLUMN colaboradores_historico.colaborador_id IS 'ID do colaborador (FK para colaboradores)';
COMMENT ON COLUMN colaboradores_historico.data_registro IS 'Data do registro (um por colaborador por dia)';
COMMENT ON COLUMN colaboradores_historico.ent1 IS 'Primeira entrada do dia';
COMMENT ON COLUMN colaboradores_historico.sai1 IS 'Primeira saída do dia';
COMMENT ON CONSTRAINT unique_colaborador_data ON colaboradores_historico IS 'Garante um único registro por colaborador por dia';

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Verificar se a tabela foi criada
SELECT 
  'Tabela colaboradores_historico criada com sucesso!' as status,
  COUNT(*) as total_registros
FROM colaboradores_historico;
