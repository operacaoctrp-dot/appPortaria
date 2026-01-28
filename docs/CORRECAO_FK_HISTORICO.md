# Correção da Foreign Key na Tabela colaboradores_historico

## Problema Identificado

A tabela `colaboradores_historico` possui uma constraint de foreign key (`fk_colaborador`) que aponta apenas para a tabela `colaboradores` (filial principal).

Isso impede o salvamento de histórico para:

- Colaboradores da **SFL** (tabela `colaboradores_sfl`)
- **Transportadoras** (tabela `colaboradorestransp`)
- **Visitantes** (tabela `visitantes`)

### Erro Apresentado

```
insert or update on table "colaboradores_historico" violates foreign key constraint "fk_colaborador"
Key is not present in table "colaboradores".
```

## Solução

A tabela `colaboradores_historico` foi projetada para ser **multi-origem**, aceitando registros de diferentes fontes de dados identificadas pelo campo `origem`:

- `principal` → tabela `colaboradores`
- `sfl` → tabela `colaboradores_sfl`
- `transportadoras` → tabela `colaboradorestransp`
- `visitantes` → tabela `visitantes`

Por isso, não pode ter uma foreign key rígida apontando para apenas uma tabela.

### Ações Necessárias

1. **Execute o script SQL** `database/remover_fk_colaborador_historico.sql` no Supabase
2. Esse script irá:
   - Remover a constraint de foreign key problemática
   - Criar índices para manter a performance
   - Preservar todos os dados existentes

### Por que remover a foreign key?

- A integridade referencial será mantida pela **aplicação** (código)
- Cada registro tem um campo `origem` que identifica de qual tabela vem o `colaborador_id`
- Isso permite flexibilidade para múltiplas fontes de dados
- Os índices criados mantêm a performance das consultas

## Como Executar a Correção

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo `database/remover_fk_colaborador_historico.sql`
4. Execute o script
5. Teste novamente o salvamento na aba SFL

## Verificação

Após executar o script, você pode verificar se não há mais constraints problemáticas executando:

```sql
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'colaboradores_historico'::regclass;
```

As únicas constraints que devem aparecer são:

- `colaboradores_historico_pkey` (PRIMARY KEY)
- Possivelmente constraints de NOT NULL em campos específicos

Não deve haver foreign keys (`contype = 'f'`).
