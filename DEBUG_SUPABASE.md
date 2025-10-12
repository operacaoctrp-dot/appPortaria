## 🔧 Configuração e Debug - Sistema de Portaria

### 1. Configurar Variáveis de Ambiente

Primeiro, você precisa configurar as credenciais do Supabase:

1. **Crie um arquivo `.env`** na raiz do projeto:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-anon-key-here
```

2. **Para encontrar essas informações**:
   - Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto
   - Vá em **Settings > API**
   - Copie a **"Project URL"** para `SUPABASE_URL`
   - Copie a **"anon public"** key para `SUPABASE_KEY`

### 2. Verificar a Tabela no Supabase

Certifique-se de que:

- A tabela `colaboradores` existe
- Tem dados inseridos
- As colunas correspondem ao tipo `Colaborador`:
  ```sql
  -- Estrutura esperada da tabela
  CREATE TABLE colaboradores (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR,
    nome VARCHAR NOT NULL,
    funcao VARCHAR,
    filial VARCHAR,
    ent1 TIMESTAMP,
    sai1 TIMESTAMP,
    ent2 TIMESTAMP,
    sai2 TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

### 3. Verificar Permissões RLS (Row Level Security)

No Supabase SQL Editor, execute:

```sql
-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'colaboradores';

-- Se RLS estiver habilitado, criar política para leitura
CREATE POLICY "Allow read access for colaboradores"
ON colaboradores FOR SELECT
USING (true);
```

### 4. Debug - Verificar Logs

1. **Inicie o servidor**: `npm run dev`
2. **Abra o DevTools** do navegador (F12)
3. **Vá para a aba Console**
4. **Navegue para `/novaEntrada`**
5. **Procure pelos logs**:
   - 🔍 Iniciando busca de colaboradores...
   - 📡 Fazendo requisição para Supabase...
   - 📊 Dados recebidos: [...]
   - ❌ Erro Supabase: [...]

### 5. Problemas Comuns e Soluções

#### Erro: "Invalid JWT"

```bash
# Limpar cache e reinstalar dependências
rm -rf node_modules .nuxt .output
npm install
```

#### Erro: "relation 'colaboradores' does not exist"

- Verifique se a tabela foi criada corretamente no Supabase
- Confirme o nome exato da tabela (sem espaços, caracteres especiais)

#### Erro: "No rows returned"

- Verifique se há dados na tabela
- Confirme as políticas RLS
- Teste a query diretamente no SQL Editor do Supabase

#### Dados não aparecem na tabela

- Verifique o console do navegador
- Confirme se as variáveis de ambiente estão corretas
- Teste a conexão com uma query simples

### 6. Teste Manual no Console

Abra o DevTools e execute:

```javascript
// Teste a conexão Supabase
const { data, error } = await $fetch("/api/_supabase/rest/v1/colaboradores", {
  headers: {
    apikey: "sua-anon-key-aqui",
    Authorization: "Bearer sua-anon-key-aqui",
  },
});
console.log("Data:", data, "Error:", error);
```

### 7. Verificação Rápida

Execute este comando para verificar se tudo está funcionando:

```bash
# No terminal do projeto
npm run dev
```

Depois acesse `http://localhost:3001/novaEntrada` e verifique:

- ✅ Página carrega sem erros
- ✅ Logs aparecem no console
- ✅ Dados são retornados pela API
- ✅ Tabela exibe os colaboradores

### 8. Estrutura de Dados Esperada

Os dados retornados devem ter esta estrutura:

```json
[
  {
    "id": 1,
    "matricula": "12345",
    "nome": "João Silva",
    "funcao": "Desenvolvedor",
    "filial": "Matriz",
    "ent1": "2024-01-15T08:00:00Z",
    "sai1": "2024-01-15T17:00:00Z",
    "created_at": "2024-01-15T07:00:00Z"
  }
]
```

---

## 🆘 Se ainda não funcionar

1. **Copie os logs do console** e envie aqui
2. **Verifique se o arquivo `.env` está sendo carregado**:
   ```javascript
   console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
   ```
3. **Teste a query diretamente no Supabase SQL Editor**:
   ```sql
   SELECT * FROM colaboradores ORDER BY nome;
   ```

O sistema está configurado para exibir logs detalhados, então qualquer problema será visível no console do navegador! 🚀
