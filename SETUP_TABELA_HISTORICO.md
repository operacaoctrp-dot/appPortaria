# IMPORTANTE: Executar Script de Criação da Tabela

## ⚠️ Problema Identificado

A funcionalidade de edição de horários na página `novaEntrada.vue` **requer** que a tabela `colaboradores_historico` exista no banco de dados.

## 🔧 Solução

Execute o script SQL localizado em:

```
database/create_historico_table.sql
```

### Como executar:

1. **Acesse o Supabase Dashboard**

   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Abra o Editor SQL**

   - No menu lateral, clique em "SQL Editor"

3. **Execute o Script**

   - Copie todo o conteúdo do arquivo `database/create_historico_table.sql`
   - Cole no editor SQL
   - Clique em "Run" ou pressione Ctrl+Enter

4. **Verifique a Criação**
   - Vá em "Table Editor"
   - Verifique se a tabela `colaboradores_historico` aparece na lista

### Estrutura da Tabela

A tabela `colaboradores_historico` armazena:

- ✅ Histórico diário de entrada/saída
- ✅ Até 5 movimentações por dia (ent1-ent5, sai1-sai5)
- ✅ Snapshot dos dados cadastrais do dia
- ✅ Um registro único por colaborador por dia

### Após Executar

Após criar a tabela:

1. Recarregue a página `novaEntrada.vue`
2. Tente editar um horário novamente
3. Verifique o console do navegador para logs de sucesso

### Verificação

Para verificar se a tabela foi criada corretamente, execute:

```sql
SELECT * FROM colaboradores_historico LIMIT 1;
```

Se não retornar erro, a tabela está pronta! 🎉

---

## 📝 Comportamento Atual

**Sem a tabela:**

- ❌ Edições de horário não são salvas
- ❌ Erro no console: "relation colaboradores_historico does not exist"

**Com a tabela:**

- ✅ Edições de horário são salvas imediatamente
- ✅ Histórico preservado por data
- ✅ Consulta de dias anteriores funcional
