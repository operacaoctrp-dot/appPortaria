-- Verificar datas de entrada dos colaboradores que estão presentes
SELECT 
    colaborador_id,
    nome,
    funcao,
    data_registro,
    ent1, ent2, ent3, ent4, ent5,
    sai1, sai2, sai3, sai4, sai5,
    origem
FROM colaboradores_historico
WHERE origem = 'principal'
    AND colaborador_id IN (780001569, 780001583, 780004545)
ORDER BY colaborador_id, data_registro DESC;
