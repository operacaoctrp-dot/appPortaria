-- Script para remover a constraint de foreign key que está impedindo
-- o salvamento de histórico de colaboradores SFL, transportadoras e visitantes
-- 
-- PROBLEMA: A tabela colaboradores_historico tem uma FK que aponta apenas 
-- para a tabela "colaboradores", mas precisamos aceitar IDs de:
-- - colaboradores (principal)
-- - colaboradores_sfl (SFL)
-- - colaboradorestransp (transportadoras)
-- - visitantes (visitantes)

-- 1. Remover a constraint de foreign key existente
ALTER TABLE colaboradores_historico 
DROP CONSTRAINT IF EXISTS fk_colaborador;

-- 2. Remover também outras possíveis constraints relacionadas
ALTER TABLE colaboradores_historico 
DROP CONSTRAINT IF EXISTS colaboradores_historico_colaborador_id_fkey;

-- 3. Verificar se há outras constraints
-- Execute este SELECT para ver se ainda há constraints:
-- SELECT conname, contype 
-- FROM pg_constraint 
-- WHERE conrelid = 'colaboradores_historico'::regclass;

-- NOTA: Removemos a constraint porque a tabela colaboradores_historico
-- é multi-origem e aceita IDs de diferentes tabelas dependendo do campo 'origem'.
-- A integridade referencial será mantida pela aplicação.

-- 4. Criar um índice no campo colaborador_id para manter performance
CREATE INDEX IF NOT EXISTS idx_colaboradores_historico_colaborador_id 
ON colaboradores_historico(colaborador_id);

-- 5. Criar um índice composto para melhorar as consultas mais comuns
CREATE INDEX IF NOT EXISTS idx_colaboradores_historico_lookup 
ON colaboradores_historico(colaborador_id, data_registro, origem);
