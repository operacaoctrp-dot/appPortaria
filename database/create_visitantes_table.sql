-- ====================================================
-- SCRIPT: Criar tabela VISITANTES
-- Data: 5 de Dezembro de 2025
-- Descrição: Tabela cadastral para visitantes
-- ====================================================

-- 1. Criar tabela visitantes
CREATE TABLE IF NOT EXISTS visitantes (
  id BIGSERIAL PRIMARY KEY,
  rg VARCHAR(20),
  nome VARCHAR(255),
  empresa VARCHAR(255),
  autorizacao VARCHAR(255),
  informada_portaria BOOLEAN DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_visitantes_nome ON visitantes(nome);
CREATE INDEX IF NOT EXISTS idx_visitantes_rg ON visitantes(rg);
CREATE INDEX IF NOT EXISTS idx_visitantes_empresa ON visitantes(empresa);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE visitantes ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de acesso
-- Permitir SELECT para usuários autenticados
CREATE POLICY "Permitir SELECT em visitantes para usuários autenticados"
  ON visitantes
  FOR SELECT
  TO authenticated
  USING (true);

-- Permitir INSERT para usuários autenticados
CREATE POLICY "Permitir INSERT em visitantes para usuários autenticados"
  ON visitantes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Permitir UPDATE para usuários autenticados
CREATE POLICY "Permitir UPDATE em visitantes para usuários autenticados"
  ON visitantes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir DELETE para usuários autenticados
CREATE POLICY "Permitir DELETE em visitantes para usuários autenticados"
  ON visitantes
  FOR DELETE
  TO authenticated
  USING (true);

-- 5. Comentários nas colunas
COMMENT ON TABLE visitantes IS 'Tabela cadastral de visitantes';
COMMENT ON COLUMN visitantes.id IS 'Identificador único do visitante';
COMMENT ON COLUMN visitantes.rg IS 'Número do RG do visitante';
COMMENT ON COLUMN visitantes.nome IS 'Nome completo do visitante';
COMMENT ON COLUMN visitantes.empresa IS 'Empresa do visitante';
COMMENT ON COLUMN visitantes.autorizacao IS 'Nome de quem autorizou a visita';
COMMENT ON COLUMN visitantes.informada_portaria IS 'Se a portaria foi informada sobre a visita (true=Sim, false=Não, null=Não informado)';

-- ====================================================
-- FIM DO SCRIPT
-- ====================================================

-- Verificar se a tabela foi criada corretamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'visitantes'
ORDER BY ordinal_position;
