-- Script para verificar a tabela colaboradores (tempo real)
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
WHERE ent1 IS NOT NULL OR ent2 IS NOT NULL OR ent3 IS NOT NULL
ORDER BY nome;
