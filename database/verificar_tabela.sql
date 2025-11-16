-- ============================================
-- VERIFICAR SE A TABELA FOI CRIADA CORRETAMENTE
-- ============================================

-- 1. Verificar se a tabela existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_name = 'colaboradores_historico';

-- 2. Ver a estrutura da tabela (colunas)
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'colaboradores_historico'
ORDER BY ordinal_position;

-- 3. Ver os índices criados
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'colaboradores_historico';

-- 4. Ver as políticas RLS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'colaboradores_historico';

-- 5. Contar registros (deve estar vazio)
SELECT 
  COUNT(*) as total_registros
FROM colaboradores_historico;
