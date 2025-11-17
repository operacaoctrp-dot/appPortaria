-- Script para verificar as entradas de hoje na tabela colaboradores
-- Execute este script no Supabase SQL Editor para diagnosticar o problema

-- 1. Ver todos os colaboradores da tabela principal
SELECT 
  id,
  nome,
  funcao,
  matricula,
  filial,
  ent1,
  ent2,
  ent3,
  sai1,
  sai2,
  sai3
FROM colaboradores
ORDER BY nome;

-- 2. Contar quantos têm entrada registrada
SELECT 
  COUNT(*) as total_colaboradores,
  COUNT(ent1) as com_ent1,
  COUNT(ent2) as com_ent2,
  COUNT(sai1) as com_sai1
FROM colaboradores;

-- 3. Ver colaboradores que deram entrada hoje (têm ent1 preenchido)
SELECT 
  id,
  nome,
  funcao,
  matricula,
  ent1,
  sai1,
  CASE 
    WHEN ent1 IS NOT NULL AND sai1 IS NULL THEN 'PRESENTE'
    WHEN ent1 IS NOT NULL AND sai1 IS NOT NULL THEN 'JÁ SAIU'
    ELSE 'SEM ENTRADA'
  END as status
FROM colaboradores
WHERE ent1 IS NOT NULL
ORDER BY ent1 DESC;

-- 4. Ver histórico de hoje
SELECT 
  id,
  colaborador_id,
  nome,
  funcao,
  matricula,
  data_registro,
  origem,
  ent1,
  ent2,
  sai1,
  sai2,
  created_at
FROM colaboradores_historico
WHERE data_registro = CURRENT_DATE
ORDER BY created_at DESC;
