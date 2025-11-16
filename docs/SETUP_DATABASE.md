# 🚀 INSTRUÇÕES PARA CRIAR TABELA DE HISTÓRICO

## ⚡ Passo 1: Acessar o Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto (appPortaria)
3. No menu lateral, clique em **"SQL Editor"**

## 📝 Passo 2: Executar o SQL

1. Clique em **"New query"** (ou pressione `Ctrl+Enter` para nova aba)
2. Abra o arquivo: `database/create_historico_table.sql`
3. **Copie TODO o conteúdo** do arquivo
4. **Cole** no editor SQL do Supabase
5. Clique em **"Run"** (ou pressione `Ctrl+Enter`)

## ✅ Passo 3: Verificar se funcionou

Você deve ver a mensagem:

```
Tabela colaboradores_historico criada com sucesso!
total_registros: 0
```

### Se der erro de "relation already exists"

Isso significa que a tabela já existe. Está tudo ok! Pode prosseguir.

### Se der erro de "foreign key constraint"

Execute este comando antes:

```sql
-- Verificar se a tabela colaboradores existe
SELECT * FROM colaboradores LIMIT 1;
```

Se der erro, significa que a tabela `colaboradores` não existe ou tem outro nome.

## 🔍 Passo 4: Verificar estrutura criada

Execute este comando para confirmar:

```sql
-- Ver estrutura da tabela
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'colaboradores_historico'
ORDER BY ordinal_position;
```

Deve retornar todas as colunas:

- id
- colaborador_id
- data_registro
- nome, funcao, filial, matricula
- ent1, sai1, ent2, sai2, ent3, sai3, ent4, sai4, ent5, sai5
- created_at, updated_at

## 🎯 Passo 5: Testar inserção

Execute este teste para garantir que está funcionando:

```sql
-- Buscar um colaborador existente
SELECT id, nome FROM colaboradores LIMIT 1;

-- Copie o ID retornado e substitua no comando abaixo
-- Exemplo: se o ID for 1
INSERT INTO colaboradores_historico (
  colaborador_id,
  data_registro,
  nome,
  ent1
) VALUES (
  1,  -- ← Substitua pelo ID real
  CURRENT_DATE,
  'Teste',
  NOW()
);

-- Verificar se foi inserido
SELECT * FROM colaboradores_historico;

-- Deletar o teste
DELETE FROM colaboradores_historico WHERE nome = 'Teste';
```

## ✅ PRONTO!

Se todos os passos funcionaram, a tabela está criada e pronta para uso!

**Próximo passo:** Volte para o VS Code e me avise que a tabela foi criada. Vou continuar a implementação no frontend! 🚀

---

## 🐛 Problemas Comuns

### Erro: "permission denied for table colaboradores"

**Solução:** Você precisa ter permissões de admin no Supabase. Entre com a conta correta.

### Erro: "relation 'colaboradores' does not exist"

**Solução:** A tabela principal não existe. Execute primeiro:

```sql
-- Ver todas as tabelas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### Erro: RLS policies não foram criadas

**Solução:** Execute apenas a parte de RLS novamente:

```sql
ALTER TABLE colaboradores_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de histórico"
  ON colaboradores_historico
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir escrita de histórico"
  ON colaboradores_historico
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```
