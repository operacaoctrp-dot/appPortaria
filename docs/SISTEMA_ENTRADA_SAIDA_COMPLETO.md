# 🎯 Sistema de Entrada e Saída - Solução Completa

## 📊 Problema Identificado

O sistema atual tinha limitações:

- ❌ Dados eram salvos apenas na tabela `colaboradores`
- ❌ Sem histórico para consultar dias anteriores
- ❌ Difícil visualizar movimentações de qualquer data
- ❌ Perda de dados ao final do dia

---

## ✅ Solução Implementada

### Arquitetura de Duas Tabelas

```
┌──────────────────────┐      ┌─────────────────────────────┐
│   colaboradores      │      │  colaboradores_historico    │
│  (dados do dia)      │      │  (histórico completo)       │
├──────────────────────┤      ├─────────────────────────────┤
│ id                   │─────┐│ id                          │
│ nome                 │     ││ colaborador_id (FK)         │
│ funcao               │     └│ data_registro (DATE)        │
│ filial               │      │ nome, funcao, filial        │
│ matricula            │      │ matricula                   │
│ ent1, ent2 ... ent5  │      │ ent1, ent2 ... ent5         │
│ sai1, sai2 ... sai5  │      │ sai1, sai2 ... sai5         │
└──────────────────────┘      └─────────────────────────────┘
   (sempre hoje)                  (todos os dias)
```

---

## 🔧 Novo Composable: useHistoricoMovimentacao

**Arquivo**: `app/composables/useHistoricoMovimentacao.ts`

### Funcionalidades:

#### 1. `registrarMovimentacao(colaboradorId, tipo)`

Registra uma entrada ou saída:

```typescript
const { registrarMovimentacao } = useHistorico();

// Registrar entrada
await registrarMovimentacao(123, "entrada");

// Registrar saída
await registrarMovimentacao(123, "saida");
```

**O que faz**:

1. ✅ Busca dados atuais do colaborador
2. ✅ Encontra próximo slot disponível (ent1-ent5 ou sai1-sai5)
3. ✅ Atualiza tabela `colaboradores` (dia atual)
4. ✅ Atualiza ou cria registro em `colaboradores_historico`
5. ✅ Retorna sucesso ou erro

**Limite**: Máximo de 5 entradas e 5 saídas por dia por colaborador.

---

#### 2. `buscarMovimentacoesDia(data)`

Busca todas as movimentações de um dia específico:

```typescript
const { buscarMovimentacoesDia } = useHistorico();

// Buscar movimentações de hoje
const hoje = await buscarMovimentacoesDia("2025-10-24");

// Buscar movimentações de qualquer dia
const ontem = await buscarMovimentacoesDia("2025-10-23");
```

**Retorna**:

```typescript
[
  {
    id: 1,
    colaborador_id: 123,
    nome: "João Silva",
    funcao: "Desenvolvedor",
    tipo: "entrada",
    hora: "2025-10-24T08:30:00Z",
    data: "2025-10-24"
  },
  {
    id: 2,
    colaborador_id: 123,
    nome: "João Silva",
    funcao: "Desenvolvedor",
    tipo: "saida",
    hora: "2025-10-24T12:00:00Z",
    data: "2025-10-24"
  },
  ...
]
```

**Lógica**:

- Se a data for **hoje**: busca da tabela `colaboradores`
- Se a data for **outro dia**: busca da tabela `colaboradores_historico`

---

#### 3. `buscarResumoColaboradoresDia(data)`

Busca resumo de todos os colaboradores de um dia:

```typescript
const { buscarResumoColaboradoresDia } = useHistorico();

const resumo = await buscarResumoColaboradoresDia("2025-10-24");
```

**Retorna**:

```typescript
[
  {
    colaborador_id: 123,
    nome: "João Silva",
    funcao: "Desenvolvedor",
    entradas: ["08:30:00", "13:00:00"],
    saidas: ["12:00:00"],
    presente: true, // tem mais entradas que saídas
  },
  {
    colaborador_id: 456,
    nome: "Maria Santos",
    funcao: "Designer",
    entradas: ["09:00:00"],
    saidas: ["18:00:00"],
    presente: false, // saiu
  },
];
```

---

#### 4. `limparRegistrosDiaAtual()`

Limpa os campos de entrada/saída da tabela `colaboradores`:

```typescript
const { limparRegistrosDiaAtual } = useHistorico();

// Executar no final do dia ou início de novo dia
await limparRegistrosDiaAtual();
```

**Importante**:

- ✅ Limpa apenas ent1-ent5 e sai1-sai5
- ✅ Mantém dados do colaborador (nome, função, etc)
- ✅ Histórico permanece intacto em `colaboradores_historico`

---

## 📝 Fluxo Completo de Registro

### Exemplo: Registrar Entrada

```
1. Usuário clica "Registrar Entrada" para João Silva (id: 123)
   ↓
2. registrarMovimentacao(123, "entrada")
   ↓
3. Busca dados do colaborador na tabela colaboradores
   ↓
4. Verifica slots disponíveis:
   - ent1: null ✅ (disponível)
   - ent2: null
   - ent3: null
   ↓
5. Atualiza colaboradores:
   UPDATE colaboradores
   SET ent1 = '2025-10-24T08:30:00Z'
   WHERE id = 123
   ↓
6. Verifica se existe registro no histórico de hoje:
   SELECT * FROM colaboradores_historico
   WHERE colaborador_id = 123
   AND data_registro = '2025-10-24'
   ↓
7a. SE NÃO EXISTE:
    INSERT INTO colaboradores_historico
    (colaborador_id, data_registro, nome, funcao, ent1)
    VALUES (123, '2025-10-24', 'João Silva', 'Dev', '08:30:00')

7b. SE EXISTE:
    UPDATE colaboradores_historico
    SET ent1 = '2025-10-24T08:30:00Z'
    WHERE id = ...
   ↓
8. Retorna { success: true }
```

---

## 🎨 Como Integrar na Página Index.vue

### 1. Importar o Composable

```vue
<script setup>
import { useHistoricoMovimentacao } from "@/composables/useHistoricoMovimentacao";

const {
  registrarMovimentacao,
  buscarMovimentacoesDia,
  buscarResumoColaboradoresDia,
  loading,
  error,
} = useHistoricoMovimentacao();
</script>
```

### 2. Registrar Entrada

```typescript
const registrarEntrada = async () => {
  if (!colaboradorSelecionado.value) return;

  const resultado = await registrarMovimentacao(
    colaboradorSelecionado.value.id,
    "entrada"
  );

  if (resultado.success) {
    // Sucesso!
    alert("Entrada registrada!");

    // Atualizar lista
    await carregarMovimentacoes();
  } else {
    alert(`Erro: ${resultado.error}`);
  }
};
```

### 3. Registrar Saída

```typescript
const registrarSaida = async () => {
  if (!colaboradorSelecionado.value) return;

  const resultado = await registrarMovimentacao(
    colaboradorSelecionado.value.id,
    "saida"
  );

  if (resultado.success) {
    alert("Saída registrada!");
    await carregarMovimentacoes();
  } else {
    alert(`Erro: ${resultado.error}`);
  }
};
```

### 4. Visualizar Movimentações de Qualquer Dia

```vue
<template>
  <div>
    <!-- Seletor de Data -->
    <input
      type="date"
      v-model="dataSelecionada"
      @change="carregarMovimentacoes"
    />

    <!-- Lista de Movimentações -->
    <div v-if="loading">Carregando...</div>

    <div v-for="mov in movimentacoes" :key="mov.id">
      <span>{{ mov.nome }}</span>
      <span>{{ mov.tipo }}</span>
      <span>{{ formatarHora(mov.hora) }}</span>
    </div>
  </div>
</template>

<script setup>
const dataSelecionada = ref(new Date().toISOString().split("T")[0]);
const movimentacoes = ref([]);

const carregarMovimentacoes = async () => {
  movimentacoes.value = await buscarMovimentacoesDia(dataSelecionada.value);
};

// Carregar ao montar
onMounted(async () => {
  await carregarMovimentacoes();
});
</script>
```

---

## 📊 Exemplo de Dashboard com Resumo

```vue
<template>
  <div class="grid grid-cols-3 gap-4">
    <!-- Colaboradores Presentes -->
    <div
      v-for="colaborador in resumo"
      :key="colaborador.colaborador_id"
      class="card"
    >
      <h3>{{ colaborador.nome }}</h3>
      <p>{{ colaborador.funcao }}</p>

      <!-- Entradas -->
      <div>
        <strong>Entradas:</strong>
        <span v-for="ent in colaborador.entradas" :key="ent">
          {{ formatarHora(ent) }}
        </span>
      </div>

      <!-- Saídas -->
      <div>
        <strong>Saídas:</strong>
        <span v-for="sai in colaborador.saidas" :key="sai">
          {{ formatarHora(sai) }}
        </span>
      </div>

      <!-- Status -->
      <div :class="colaborador.presente ? 'bg-green-500' : 'bg-red-500'">
        {{ colaborador.presente ? "🟢 Presente" : "🔴 Ausente" }}
      </div>
    </div>
  </div>
</template>

<script setup>
const dataSelecionada = ref(new Date().toISOString().split("T")[0]);
const resumo = ref([]);

const carregarResumo = async () => {
  resumo.value = await buscarResumoColaboradoresDia(dataSelecionada.value);
};

watch(dataSelecionada, () => {
  carregarResumo();
});

onMounted(() => {
  carregarResumo();
});
</script>
```

---

## 🔄 Rotina Diária Recomendada

### Início do Dia (Automático)

Criar um cron job ou função serverless que executa todo dia às 00:01:

```typescript
// Executar automaticamente no início do dia
async function rotinaDiaria() {
  const { limparRegistrosDiaAtual } = useHistoricoMovimentacao();

  console.log("🌅 Iniciando novo dia...");

  // Limpar registros da tabela colaboradores
  await limparRegistrosDiaAtual();

  console.log("✅ Sistema pronto para novo dia!");
}
```

**Nota**: O histórico em `colaboradores_historico` NUNCA é deletado automaticamente.

---

## 🗄️ Estrutura das Tabelas

### Tabela: `colaboradores`

Armazena dados atuais (hoje):

```sql
CREATE TABLE colaboradores (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR NOT NULL,
  funcao VARCHAR,
  filial VARCHAR,
  matricula INTEGER,

  -- Entradas do dia
  ent1 TIMESTAMPTZ,
  ent2 TIMESTAMPTZ,
  ent3 TIMESTAMPTZ,
  ent4 TIMESTAMPTZ,
  ent5 TIMESTAMPTZ,

  -- Saídas do dia
  sai1 TIMESTAMPTZ,
  sai2 TIMESTAMPTZ,
  sai3 TIMESTAMPTZ,
  sai4 TIMESTAMPTZ,
  sai5 TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela: `colaboradores_historico`

Armazena histórico completo:

```sql
CREATE TABLE colaboradores_historico (
  id BIGSERIAL PRIMARY KEY,
  colaborador_id BIGINT NOT NULL,
  data_registro DATE NOT NULL,

  -- Snapshot dos dados
  nome VARCHAR,
  funcao VARCHAR,
  filial VARCHAR,
  matricula VARCHAR,

  -- Entradas do dia
  ent1 TIMESTAMPTZ,
  ent2 TIMESTAMPTZ,
  ent3 TIMESTAMPTZ,
  ent4 TIMESTAMPTZ,
  ent5 TIMESTAMPTZ,

  -- Saídas do dia
  sai1 TIMESTAMPTZ,
  sai2 TIMESTAMPTZ,
  sai3 TIMESTAMPTZ,
  sai4 TIMESTAMPTZ,
  sai5 TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_colaborador
    FOREIGN KEY (colaborador_id)
    REFERENCES colaboradores(id)
    ON DELETE CASCADE,

  -- Um colaborador só pode ter 1 registro por dia
  CONSTRAINT unique_colaborador_data
    UNIQUE (colaborador_id, data_registro)
);

-- Índices para performance
CREATE INDEX idx_historico_colaborador ON colaboradores_historico(colaborador_id);
CREATE INDEX idx_historico_data ON colaboradores_historico(data_registro);
CREATE INDEX idx_historico_colaborador_data ON colaboradores_historico(colaborador_id, data_registro);
```

---

## ✅ Vantagens da Solução

1. **Histórico Completo**: Todos os dias são salvos permanentemente
2. **Performance**: Tabela `colaboradores` sempre pequena (só hoje)
3. **Auditoria**: Histórico imutável para relatórios
4. **Flexibilidade**: Consultar qualquer dia facilmente
5. **Escalável**: Índices otimizados para consultas rápidas
6. **Seguro**: Constraints impedem duplicatas

---

## 🎯 Próximos Passos

1. **Criar a tabela no Supabase** (executar SQL em `database/create_historico_table.sql`)
2. **Integrar na página index.vue** (substituir funções antigas)
3. **Testar entrada e saída**
4. **Adicionar seletor de data** para visualizar histórico
5. **Criar rotina de limpeza diária** (opcional, pode usar Supabase Cron)

---

**Data**: 24/10/2025  
**Status**: ✅ Composable criado e documentado  
**Próximo**: Integrar na página index.vue
