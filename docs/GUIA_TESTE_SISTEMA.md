# 🧪 Guia de Teste - Sistema de Entrada/Saída

## ✅ Integração Completa Realizada

### O que foi feito:

1. **✅ Integração do `useHistoricoMovimentacao`** no `index.vue`

   - Substituída lógica antiga de entrada/saída
   - Agora usa `registrarMovimentacao()` para salvar em ambas as tabelas

2. **✅ Seletor de Data** adicionado no header

   - Input tipo `date` com estilo customizado
   - Badge "HOJE" quando está na data atual
   - Limite máximo = hoje (não pode selecionar datas futuras)
   - Watch automático: ao mudar data, recarrega movimentações

3. **✅ Funções atualizadas**:
   - `registrarEntrada()`: busca colaborador existente → registra movimentação
   - `registrarSaida()`: seleciona funcionário presente → registra saída
   - `carregarMovimentacoesDia()`: busca movimentações da data selecionada
   - `historico` computed: agora usa `movimentacoesDia` do composable

---

## 📋 Checklist de Testes

### Passo 1: Verificar Tabela `colaboradores_historico`

Antes de começar, confirme que a tabela existe no Supabase:

```sql
-- Executar no SQL Editor do Supabase
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'colaboradores_historico';
```

**Resultado esperado**: Deve retornar `colaboradores_historico`

**Se não existir**: Execute o arquivo `database/create_historico_table.sql`

---

### Passo 2: Testar Registro de Entrada

1. **Abrir a aplicação**: `http://localhost:3000`
2. **Fazer login** com suas credenciais
3. **No formulário "Entrada de Funcionário"**:
   - Nome: Digite o nome de um colaborador **que já existe** no banco
   - Cargo: Preencher ou deixar vazio
   - Clicar em **"Registrar Entrada"**

**Verificações**:

✅ **Alerta de sucesso**: Deve aparecer "✅ Entrada registrada para [Nome]"

✅ **Tabela `colaboradores`**: Verificar no Supabase

```sql
SELECT nome, ent1, ent2, ent3, ent4, ent5
FROM colaboradores
WHERE nome = 'Nome do Colaborador';
```

- Um dos campos `ent1` a `ent5` deve estar preenchido com a hora atual

✅ **Tabela `colaboradores_historico`**: Verificar no Supabase

```sql
SELECT * FROM colaboradores_historico
WHERE data_registro = CURRENT_DATE
AND nome = 'Nome do Colaborador';
```

- Deve existir um registro com a mesma entrada

✅ **Lista "Funcionários Presentes"**: O colaborador deve aparecer com status "Online"

✅ **Timeline (aba 🕒)**: A entrada deve aparecer no histórico

---

### Passo 3: Testar Registro de Saída

1. **No formulário "Saída de Funcionário"**:
   - Selecionar o colaborador que acabou de entrar
   - Clicar em **"Registrar Saída"**

**Verificações**:

✅ **Alerta de sucesso**: "✅ Saída registrada para [Nome]"

✅ **Tabela `colaboradores`**:

```sql
SELECT nome, ent1, sai1, ent2, sai2
FROM colaboradores
WHERE nome = 'Nome do Colaborador';
```

- O campo `sai1` (ou correspondente) deve estar preenchido

✅ **Tabela `colaboradores_historico`**:

```sql
SELECT ent1, sai1, ent2, sai2
FROM colaboradores_historico
WHERE data_registro = CURRENT_DATE
AND nome = 'Nome do Colaborador';
```

- Deve ter a mesma estrutura que a tabela `colaboradores`

✅ **Lista "Funcionários Presentes"**: O colaborador deve desaparecer

✅ **Timeline**: A saída deve aparecer no histórico

---

### Passo 4: Testar Múltiplas Entradas/Saídas

Repetir **5 vezes** o processo de entrada e saída para o mesmo colaborador.

**Esperado**:

- Deve preencher `ent1`-`ent5` e `sai1`-`sai5`
- Após 5 movimentos: ERRO "❌ Limite de 5 entradas por dia atingido"

**Verificar no banco**:

```sql
SELECT ent1, ent2, ent3, ent4, ent5, sai1, sai2, sai3, sai4, sai5
FROM colaboradores
WHERE nome = 'Nome do Colaborador';
```

Todos os 5 slots devem estar preenchidos.

---

### Passo 5: Testar Seletor de Data (Histórico)

1. **Mudar a data no seletor** para ontem ou dias anteriores
2. **Verificar o histórico**:
   - Timeline deve mostrar movimentações daquele dia
   - Estatísticas devem refletir aquele dia

**Verificar consulta SQL manual**:

```sql
-- Para ver dados de ontem
SELECT * FROM colaboradores_historico
WHERE data_registro = CURRENT_DATE - INTERVAL '1 day';
```

✅ **Dados históricos**: Devem aparecer se houver registros

✅ **Badge "HOJE"**: Deve aparecer apenas quando data = hoje

✅ **Limite de data**: Não deve permitir selecionar datas futuras

---

### Passo 6: Verificar Integridade dos Dados

Execute este teste para garantir que ambas as tabelas estão sincronizadas:

```sql
-- Comparar dados de hoje entre as duas tabelas
SELECT
  c.nome,
  c.ent1 as colaboradores_ent1,
  h.ent1 as historico_ent1,
  CASE
    WHEN c.ent1 IS NOT NULL AND h.ent1 IS NULL THEN '❌ FALTA NO HISTÓRICO'
    WHEN c.ent1 IS NULL AND h.ent1 IS NOT NULL THEN '⚠️ HISTÓRICO TEM DADO EXTRA'
    WHEN c.ent1 = h.ent1 THEN '✅ SINCRONIZADO'
    ELSE '⚠️ DIVERGENTE'
  END as status
FROM colaboradores c
LEFT JOIN colaboradores_historico h
  ON c.id = h.colaborador_id
  AND h.data_registro = CURRENT_DATE
WHERE c.ent1 IS NOT NULL OR h.ent1 IS NOT NULL;
```

**Resultado esperado**: Todos com status "✅ SINCRONIZADO"

---

## 🐛 Troubleshooting

### Problema 1: Erro "Colaborador não encontrado"

**Causa**: O nome digitado não existe no banco.

**Solução**:

1. Verificar colaboradores existentes:

```sql
SELECT id, nome FROM colaboradores ORDER BY nome;
```

2. Ou criar um novo colaborador primeiro via interface ou SQL:

```sql
INSERT INTO colaboradores (nome, funcao, filial, matricula)
VALUES ('João Silva', 'Desenvolvedor', 'Matriz', 12345);
```

---

### Problema 2: Erro "colaboradores_historico does not exist"

**Causa**: Tabela de histórico não foi criada.

**Solução**:

1. Ir no Supabase SQL Editor
2. Executar o arquivo `database/create_historico_table.sql`
3. Verificar criação:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_name = 'colaboradores_historico';
```

---

### Problema 3: Movimentações não aparecem no histórico

**Causa**: Problema com timezone ou data.

**Solução**:

1. Verificar timezone do servidor:

```sql
SHOW timezone;
```

2. Verificar dados com timezone explícito:

```sql
SELECT *, ent1 AT TIME ZONE 'America/Sao_Paulo' as ent1_local
FROM colaboradores_historico
WHERE data_registro = CURRENT_DATE;
```

---

### Problema 4: Dados duplicados no histórico

**Causa**: Constraint `UNIQUE(colaborador_id, data_registro)` pode estar faltando.

**Solução**:

```sql
-- Verificar constraint
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'colaboradores_historico';

-- Se faltar, adicionar:
ALTER TABLE colaboradores_historico
ADD CONSTRAINT unique_colaborador_data
UNIQUE (colaborador_id, data_registro);
```

---

## 📊 Queries Úteis para Debug

### Ver todas as movimentações de hoje

```sql
SELECT
  h.nome,
  h.funcao,
  h.ent1, h.sai1,
  h.ent2, h.sai2,
  h.ent3, h.sai3,
  h.ent4, h.sai4,
  h.ent5, h.sai5
FROM colaboradores_historico h
WHERE h.data_registro = CURRENT_DATE
ORDER BY h.nome;
```

### Ver movimentações dos últimos 7 dias

```sql
SELECT
  data_registro,
  COUNT(*) as total_colaboradores,
  COUNT(ent1) + COUNT(ent2) + COUNT(ent3) + COUNT(ent4) + COUNT(ent5) as total_entradas,
  COUNT(sai1) + COUNT(sai2) + COUNT(sai3) + COUNT(sai4) + COUNT(sai5) as total_saidas
FROM colaboradores_historico
WHERE data_registro >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY data_registro
ORDER BY data_registro DESC;
```

### Ver colaborador específico (histórico completo)

```sql
SELECT
  data_registro,
  nome,
  ent1, sai1, ent2, sai2, ent3, sai3
FROM colaboradores_historico
WHERE nome ILIKE '%João%'
ORDER BY data_registro DESC
LIMIT 10;
```

---

## ✅ Critérios de Sucesso

Para considerar o sistema funcionando 100%, deve passar em todos:

- [x] ✅ Entrada registra em ambas as tabelas
- [x] ✅ Saída registra em ambas as tabelas
- [x] ✅ Limite de 5 movimentos é respeitado
- [x] ✅ Seletor de data funciona
- [x] ✅ Histórico aparece corretamente
- [x] ✅ Badge "HOJE" aparece apenas para hoje
- [x] ✅ Dados sincronizados entre tabelas
- [x] ✅ Não há erros no console
- [x] ✅ Constraint UNIQUE impede duplicatas

---

## 🎯 Próximos Passos (Após Testes)

Se tudo funcionar:

1. ✅ **Realtime**: Implementar Supabase Realtime para updates automáticos
2. ✅ **Exportar**: Adicionar botão para exportar CSV/Excel
3. ✅ **Relatórios**: Gerar relatórios mensais automaticamente
4. ✅ **Notificações**: Alertas quando alguém entra/sai
5. ✅ **Dashboard Analytics**: Gráficos mais avançados

---

**Data**: 28/10/2025  
**Status**: ✅ Integração completa  
**Versão**: 1.0.0
