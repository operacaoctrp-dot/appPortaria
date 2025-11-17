-- Script para adicionar coluna 'origem' na tabela colaboradores_historico
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar coluna 'origem' caso não exista
ALTER TABLE colaboradores_historico 
ADD COLUMN IF NOT EXISTS origem VARCHAR(20) DEFAULT 'principal';

-- 2. Criar índice para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_colaboradores_historico_origem 
ON colaboradores_historico(origem);

-- 3. Criar índice composto para consultas por colaborador_id, data_registro e origem
CREATE INDEX IF NOT EXISTS idx_colaboradores_historico_colaborador_data_origem 
ON colaboradores_historico(colaborador_id, data_registro, origem);

-- 4. Adicionar comentário na coluna
COMMENT ON COLUMN colaboradores_historico.origem IS 'Origem do registro: principal ou sfl';

-- 5. Atualizar registros existentes para 'principal' caso sejam null
UPDATE colaboradores_historico 
SET origem = 'principal' 
WHERE origem IS NULL;

-- Verificação: Contar registros por origem
SELECT origem, COUNT(*) as total 
FROM colaboradores_historico 
GROUP BY origem;
