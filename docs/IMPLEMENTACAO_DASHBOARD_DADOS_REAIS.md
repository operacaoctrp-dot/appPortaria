# 🚀 Implementação: Dashboard com Dados Reais

## ✅ O Que Foi Implementado

### 1. Composable `useAnalyticsData.ts`

Criado composable completo para buscar dados reais do Supabase:

#### Funções Disponíveis:

**📊 `getPeriodStats(period)`**

- Retorna estatísticas do período (hoje, semana, mês)
- Calcula total de entradas, saídas e diferença
- Suporta períodos: `"today"`, `"week"`, `"month"`

**⏰ `getHourlyStats()`**

- Movimentações por hora do dia atual
- Faixa horária: 6h às 20h
- Separa entradas e saídas por hora

**📅 `getWeeklyStats()`**

- Movimentações dos últimos 7 dias
- Agrupa por dia da semana (Seg, Ter, Qua...)
- Dados para gráfico semanal

**📆 `getMonthlyStats()`**

- Movimentações dos últimos 30 dias
- Agrupa por semana do mês
- Dados para gráfico mensal

**🏆 `getTopColaboradores(limit)`**

- Ranking dos colaboradores mais frequentes
- Conta todas as movimentações (entradas + saídas)
- Limita resultados (padrão: 10)

#### Recursos:

- ✅ Loading state para cada requisição
- ✅ Error handling com mensagens amigáveis
- ✅ TypeScript tipado com Database types
- ✅ Agregação eficiente de dados
- ✅ Fallback para erros

---

### 2. Analytics Store Atualizado

**Antes:**

```typescript
// Apenas mock data estático
const current = ref(mock.today);

function updatePeriod(period) {
  current.value = getChartData(period);
}
```

**Depois:**

```typescript
// Suporta dados reais E mock
const useRealData = ref(true);
const loading = ref(false);

async function loadRealData(period) {
  // Busca dados do Supabase
  const data = await analyticsData.getHourlyStats();
  current.value = transformToChartData(data);
}

async function updatePeriod(period) {
  if (useRealData.value) {
    await loadRealData(period);
  } else {
    current.value = mock[period];
  }
}
```

#### Novos Recursos:

- ✅ **Flag `useRealData`**: Alternar entre real/mock
- ✅ **Loading state**: Indicador de carregamento
- ✅ **Fallback automático**: Se falhar, usa mock
- ✅ **`initialize()`**: Carrega dados ao iniciar
- ✅ **Transformação de dados**: Converte para formato Chart.js

---

## 📊 Fluxo de Dados

```
1. Página/Componente
   ↓
2. useAnalyticsStore()
   ├─→ useRealData = true
   │   ↓
   │   3. loadRealData(period)
   │      ↓
   │      4. useAnalyticsData()
   │         ├─→ getHourlyStats() [today]
   │         ├─→ getWeeklyStats() [week]
   │         └─→ getMonthlyStats() [month]
   │         ↓
   │      5. Supabase Query
   │         SELECT ent1, sai1, ent2...
   │         FROM colaboradores
   │         WHERE created_at >= ...
   │         ↓
   │      6. Processa dados (agrupa, conta)
   │         ↓
   │      7. Retorna { labels, datasets }
   │         ↓
   │      8. Atualiza store.current
   │         ↓
   │      9. Chart.js renderiza gráfico
   │
   └─→ useRealData = false
       ↓
       Usa mock data (desenvolvimento/testes)
```

---

## 🎯 Como Usar

### No Componente/Página:

```typescript
<script setup>
import { useAnalyticsStore } from '@/stores/analytics';
import { storeToRefs } from 'pinia';

const store = useAnalyticsStore();
const { current, loading, summary } = storeToRefs(store);

// Carregar dados iniciais
onMounted(async () => {
  await store.initialize();
});

// Trocar período
const changePeriod = async (period: 'today' | 'week' | 'month') => {
  await store.updatePeriod(period);
};
</script>

<template>
  <div>
    <!-- Indicador de loading -->
    <div v-if="loading">Carregando...</div>

    <!-- Gráfico -->
    <ChartCard
      :chart-data="current"
      type="bar"
    />

    <!-- Estatísticas -->
    <div>
      <p>Entradas: {{ summary[0]?.value }}</p>
      <p>Saídas: {{ summary[1]?.value }}</p>
      <p>Diferença: {{ summary[2]?.value }}</p>
    </div>

    <!-- Botões de período -->
    <button @click="changePeriod('today')">Hoje</button>
    <button @click="changePeriod('week')">Semana</button>
    <button @click="changePeriod('month')">Mês</button>
  </div>
</template>
```

---

## 🔍 Queries Otimizadas

### Exemplo: Stats Horárias (Hoje)

```sql
SELECT ent1, sai1, ent2, sai2, ent3, sai3, ent4, sai4, ent5, sai5
FROM colaboradores
WHERE created_at >= '2025-10-24T00:00:00'
  AND created_at <= '2025-10-24T23:59:59'
```

**Processamento:**

```typescript
// Para cada colaborador
data.forEach((row) => {
  // Extrair hora de cada entrada
  [ent1, ent2, ent3, ent4, ent5].forEach((ent) => {
    if (ent) {
      const hour = new Date(ent).getHours();
      stats[hour].entradas++;
    }
  });

  // Extrair hora de cada saída
  [sai1, sai2, sai3, sai4, sai5].forEach((sai) => {
    if (sai) {
      const hour = new Date(sai).getHours();
      stats[hour].saidas++;
    }
  });
});
```

**Resultado:**

```javascript
[
  { hour: "06h", entradas: 3, saidas: 0 },
  { hour: "07h", entradas: 8, saidas: 0 },
  { hour: "08h", entradas: 14, saidas: 2 },
  ...
]
```

---

## 🎨 Formato de Dados do Chart

```typescript
{
  labels: ["06h", "08h", "10h", "12h", "14h", "16h", "18h"],
  datasets: [
    {
      label: "Entradas",
      data: [3, 8, 14, 9, 7, 5, 2],
      backgroundColor: "#3B82F6",  // Azul
      borderColor: "#2563EB"
    },
    {
      label: "Saídas",
      data: [1, 2, 6, 5, 4, 3, 1],
      backgroundColor: "#F97316",  // Laranja
      borderColor: "#EA580C"
    }
  ]
}
```

---

## 🧪 Testando

### 1. Com Dados Reais (Padrão)

```typescript
const store = useAnalyticsStore();
store.useRealData = true;
await store.initialize();
```

### 2. Com Mock Data (Desenvolvimento)

```typescript
const store = useAnalyticsStore();
store.useRealData = false;
store.updatePeriod("today"); // Usa mock
```

### 3. Alternando Entre Modos

```vue
<template>
  <button @click="store.useRealData = !store.useRealData">
    {{ store.useRealData ? "Usar Mock" : "Usar Dados Reais" }}
  </button>
</template>
```

---

## 📈 Próximos Passos

### Agora Implementado:

- ✅ Composable de analytics com queries reais
- ✅ Store integrado com dados do Supabase
- ✅ Suporte a 3 períodos (dia, semana, mês)
- ✅ Fallback para mock em caso de erro
- ✅ Loading states

### Próximas Melhorias:

**1. Cache Inteligente** ⏰

```typescript
// Cache de 5 minutos para evitar queries repetidas
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}
```

**2. Realtime Updates** 🔴

```typescript
// Supabase Realtime para atualizar automático
supabase
  .channel("colaboradores-changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "colaboradores" },
    (payload) => {
      console.log("Mudança detectada!", payload);
      store.updatePeriod(store.currentPeriod);
    }
  )
  .subscribe();
```

**3. Otimizações de Query** 🚀

- Índices no campo `created_at`
- Agregações no banco (menos dados trafegados)
- Paginação para grandes volumes

**4. Métricas Avançadas** 📊

- Horários de pico automáticos
- Previsões com IA (tendências)
- Alertas de anomalias
- Comparação período anterior

---

## 💡 Dicas de Performance

### 1. Carregar Apenas Dados Necessários

```typescript
// ❌ Ruim: Traz todos os campos
.select('*')

// ✅ Bom: Traz apenas necessário
.select('ent1, sai1, ent2, sai2, ...')
```

### 2. Usar Índices

```sql
-- Criar índice em created_at para queries rápidas
CREATE INDEX idx_colaboradores_created_at
  ON colaboradores(created_at);
```

### 3. Limitar Período de Busca

```typescript
// Sempre use filtros de data
.gte('created_at', startDate)
.lte('created_at', endDate)
```

---

**Status**: Implementação Completa ✅  
**Data**: 2025-10-24  
**Próxima Tarefa**: Implementar cache e otimizações de performance
