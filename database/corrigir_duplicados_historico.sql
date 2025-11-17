-- Script para corrigir registros duplicados na tabela colaboradores_historico
-- Execute este script no Supabase SQL Editor ANTES de usar o sistema

-- 1. Ver os registros duplicados
SELECT colaborador_id, data_registro, origem, COUNT(*) as total
FROM colaboradores_historico
GROUP BY colaborador_id, data_registro, origem
HAVING COUNT(*) > 1;

-- 2. Remover registros duplicados, mantendo apenas o mais recente
-- Criar uma tabela temporária com os IDs que queremos manter
WITH duplicados AS (
  SELECT 
    id,
    colaborador_id,
    data_registro,
    origem,
    ROW_NUMBER() OVER (
      PARTITION BY colaborador_id, data_registro, origem 
      ORDER BY created_at DESC
    ) as rn
  FROM colaboradores_historico
)
DELETE FROM colaboradores_historico
WHERE id IN (
  SELECT id 
  FROM duplicados 
  WHERE rn > 1
);

-- 3. Verificar se ainda existem duplicados
SELECT colaborador_id, data_registro, origem, COUNT(*) as total
FROM colaboradores_historico
GROUP BY colaborador_id, data_registro, origem
HAVING COUNT(*) > 1;

-- 4. Recriar a constraint UNIQUE (se não existir)
ALTER TABLE colaboradores_historico 
DROP CONSTRAINT IF EXISTS unique_colaborador_data;

ALTER TABLE colaboradores_historico 
ADD CONSTRAINT unique_colaborador_data_origem 
UNIQUE (colaborador_id, data_registro, origem);

-- Mensagem de sucesso
SELECT 'Duplicados removidos com sucesso!' as mensagem;
