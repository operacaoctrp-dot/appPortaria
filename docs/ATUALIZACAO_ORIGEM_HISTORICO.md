# Atualização: Separação de Históricos por Origem

## 📋 Problema Resolvido

Quando você edita horários na aba SFL, os dados não devem interferir com os da aba Principal e vice-versa.

## 🔧 Solução Implementada

Adicionamos um campo `origem` na tabela de histórico que identifica se o registro pertence à tabela `colaboradores` (principal) ou `colaboradoressfl` (sfl).

## ⚙️ Como Aplicar a Atualização

### Passo 1: Acessar o Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**

### Passo 2: Executar o Script

1. Clique em **New Query** (Nova Consulta)
2. Copie todo o conteúdo do arquivo `database/adicionar_coluna_origem.sql`
3. Cole no editor SQL
4. Clique em **Run** (Executar) ou pressione `Ctrl+Enter`

### Passo 3: Verificar

Após executar, você deve ver uma mensagem de sucesso e uma tabela mostrando:

```
origem      | total
------------|------
principal   | X
```

## ✅ O que foi alterado no código

### 1. **Composable `useHistorico.ts`**

- ✅ `buscarHistoricoPorData()` agora aceita parâmetro `origem`
- ✅ `salvarHistorico()` agora salva com o campo `origem`
- ✅ `buscarHistoricosPorData()` filtra por origem

### 2. **Página `novaEntrada.vue`**

- ✅ Passa `abaFilial.value` como origem ao buscar histórico
- ✅ Passa `abaFilial.value` como origem ao salvar histórico
- ✅ Logs incluem informação de origem

## 🎯 Comportamento Esperado

### Antes da Atualização ❌

- Editar na aba SFL alterava dados da aba Principal
- Históricos eram misturados

### Depois da Atualização ✅

- **Aba Principal**: Mostra apenas históricos com `origem = 'principal'`
- **Aba SFL**: Mostra apenas históricos com `origem = 'sfl'`
- Edições são completamente independentes
- Cada aba tem seus próprios dados históricos

## 🧪 Como Testar

1. **Execute o script SQL** no Supabase
2. **Reinicie o servidor** de desenvolvimento (`npm run dev`)
3. **Acesse** a página Nova Entrada
4. **Na aba Principal**:
   - Edite um horário de entrada/saída
   - Salve a alteração
5. **Mude para aba SFL**:
   - Verifique que os horários estão vazios (independentes)
   - Edite um horário diferente
6. **Volte para aba Principal**:
   - Confirme que suas edições anteriores ainda estão lá
   - Os dados não foram afetados

## 📊 Estrutura da Tabela Atualizada

```sql
CREATE TABLE colaboradores_historico (
  id BIGSERIAL PRIMARY KEY,
  colaborador_id INTEGER NOT NULL,
  data_registro DATE NOT NULL,
  origem VARCHAR(20) DEFAULT 'principal', -- 👈 NOVO CAMPO
  nome VARCHAR(255),
  funcao VARCHAR(255),
  filial VARCHAR(255),
  matricula VARCHAR(50),
  ent1 TIMESTAMPTZ,
  sai1 TIMESTAMPTZ,
  ent2 TIMESTAMPTZ,
  sai2 TIMESTAMPTZ,
  ent3 TIMESTAMPTZ,
  sai3 TIMESTAMPTZ,
  ent4 TIMESTAMPTZ,
  sai4 TIMESTAMPTZ,
  ent5 TIMESTAMPTZ,
  sai5 TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔍 Consultas Úteis

### Ver todos os registros por origem

```sql
SELECT origem, COUNT(*) as total
FROM colaboradores_historico
GROUP BY origem;
```

### Ver histórico de um colaborador específico

```sql
SELECT * FROM colaboradores_historico
WHERE colaborador_id = 123
  AND data_registro = '2025-11-16'
  AND origem = 'principal';
```

### Limpar todos os históricos de teste (se necessário)

```sql
-- ⚠️ CUIDADO: Isso apaga TODOS os históricos!
-- DELETE FROM colaboradores_historico WHERE origem = 'sfl';
```

## 📝 Notas Importantes

- ✅ Registros antigos são automaticamente marcados como `origem = 'principal'`
- ✅ Novos registros terão origem definida automaticamente pela aba ativa
- ✅ Performance otimizada com índices
- ✅ Consultas filtram automaticamente por origem

## 🆘 Troubleshooting

### Erro: "column origem does not exist"

**Solução**: Execute o script SQL no Supabase

### Dados ainda misturados

**Solução**:

1. Limpe o cache do navegador
2. Reinicie o servidor de desenvolvimento
3. Verifique se o script SQL foi executado com sucesso

### Erro ao salvar

**Solução**: Verifique os logs do console do navegador (F12) para mais detalhes
