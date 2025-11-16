# 🔧 Como Criar a Tabela de Histórico

## ❌ Erro Atual

Você está vendo o erro: **"Erro ao carregar dados da data selecionada. Tente novamente."**

### Causa:

A tabela `colaboradores_historico` ainda não foi criada no seu banco de dados Supabase.

---

## ✅ Solução: Criar a Tabela

### Passo 1: Abrir o Supabase SQL Editor

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login
3. Selecione seu projeto **appPortaria**
4. No menu lateral, clique em **SQL Editor**

### Passo 2: Copiar o Script SQL

Copie TODO o conteúdo do arquivo:

```
database/create_historico_table.sql
```

### Passo 3: Executar o Script

1. No SQL Editor, clique em **"New Query"**
2. Cole o script completo
3. Clique em **"Run"** (ou pressione `Ctrl+Enter`)

### Passo 4: Verificar Criação

Execute esta query para confirmar que a tabela foi criada:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'colaboradores_historico';
```

**Resultado esperado:**

```
table_name
--------------------
colaboradores_historico
```

---

## 🎯 O que a Tabela Faz

A tabela `colaboradores_historico` permite:

- ✅ Armazenar o histórico de entrada/saída de TODOS os dias
- ✅ Consultar movimentações de qualquer data passada
- ✅ Manter um registro permanente para auditoria
- ✅ Visualizar relatórios mensais e anuais

### Estrutura:

- **1 registro por colaborador por dia**
- **5 entradas** (ent1, ent2, ent3, ent4, ent5)
- **5 saídas** (sai1, sai2, sai3, sai4, sai5)
- **Snapshot dos dados** (nome, função, filial, matrícula)

---

## 🧪 Testar Após Criação

1. Recarregue a página da aplicação (`Ctrl+R`)
2. Tente registrar uma entrada
3. Verifique no Supabase se o registro foi salvo:

```sql
-- Ver registros de hoje
SELECT * FROM colaboradores_historico
WHERE data_registro = CURRENT_DATE;

-- Ver todos os registros
SELECT
  data_registro,
  nome,
  ent1, sai1,
  ent2, sai2
FROM colaboradores_historico
ORDER BY data_registro DESC, nome
LIMIT 20;
```

---

## ⚠️ Importante

- A tabela é criada com `CREATE TABLE IF NOT EXISTS`, então é seguro executar várias vezes
- Não vai duplicar dados se executar novamente
- Os índices são criados automaticamente para melhorar performance
- A constraint `UNIQUE(colaborador_id, data_registro)` impede duplicatas

---

## 🐛 Troubleshooting

### Problema: Erro ao executar SQL

**Mensagem**: "permission denied" ou "insufficient privileges"

**Solução**: Certifique-se de estar conectado com o usuário correto (postgres/admin)

---

### Problema: Foreign key constraint fails

**Mensagem**: "violates foreign key constraint"

**Solução**: A tabela `colaboradores` precisa existir primeiro. Verifique:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'colaboradores';
```

---

### Problema: Ainda aparece erro na aplicação

**Soluções**:

1. **Hard Refresh**: `Ctrl+Shift+R` no navegador
2. **Limpar cache**: Fechar e reabrir o navegador
3. **Verificar console**: Abrir DevTools (F12) e ver mensagens de erro
4. **Reiniciar dev server**: Parar (`Ctrl+C`) e rodar `npm run dev` novamente

---

## ✅ Checklist de Sucesso

Após criar a tabela, você deve conseguir:

- [x] Registrar entrada de um colaborador
- [x] Registrar saída de um colaborador
- [x] Ver o colaborador em "Funcionários Presentes"
- [x] Ver a movimentação no histórico (Timeline)
- [x] Selecionar datas diferentes no seletor
- [x] Ver movimentações de dias anteriores

---

**Data**: 28/10/2025  
**Problema**: Tabela colaboradores_historico não existe  
**Solução**: Executar `database/create_historico_table.sql` no Supabase
