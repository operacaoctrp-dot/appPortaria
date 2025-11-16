<template>
  <div class="px-6 py-4 border-b border-neutral-200 bg-white">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Campo de Pesquisa -->
      <div>
        <label
          for="pesquisa"
          class="block text-sm font-medium text-secondary-700 mb-2"
        >
          Pesquisar colaboradores
        </label>
        <div class="relative">
          <input
            id="pesquisa"
            :value="modelValue"
            type="text"
            placeholder="Digite o nome, matrícula, função ou filial..."
            class="w-full px-4 py-2 pl-10 pr-4 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            @input="
              $emit(
                'update:modelValue',
                ($event.target as HTMLInputElement).value
              )
            "
          />
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-4 w-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <button
            v-if="modelValue?.trim()"
            @click="$emit('update:modelValue', '')"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              class="h-4 w-4 text-neutral-400 hover:text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Filtro de Data -->
      <div>
        <label
          for="filtroData"
          class="block text-sm font-medium text-secondary-700 mb-2"
        >
          Filtrar por data
        </label>
        <div class="relative">
          <input
            id="filtroData"
            :value="dataFiltro"
            type="date"
            class="w-full px-4 py-2 pl-10 pr-4 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            @input="
              $emit(
                'update:dataFiltro',
                ($event.target as HTMLInputElement).value
              )
            "
          />
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-4 w-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        </div>

        <!-- Botões de atalho de data -->
        <div class="flex gap-2 mt-2">
          <button
            @click="$emit('setToday')"
            class="px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
            title="Ir para hoje"
          >
            📅 Hoje
          </button>
          <button
            @click="$emit('setYesterday')"
            class="px-3 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors"
            title="Ir para ontem"
          >
            ⬅️ Ontem
          </button>
          <button
            @click="$emit('setThisWeek')"
            class="px-3 py-1 text-xs bg-success-100 text-success-700 rounded-md hover:bg-success-200 transition-colors"
          >
            Esta Semana
          </button>
        </div>
      </div>
    </div>

    <!-- Informações de filtro ativo -->
    <div
      v-if="dataFiltro || modelValue?.trim()"
      class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
    >
      <div class="flex items-center text-sm text-blue-800">
        <svg
          class="h-4 w-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Filtros ativos:</span>
        <span
          v-if="dataFiltro"
          class="ml-2 px-2 py-1 bg-blue-100 rounded text-xs"
        >
          📅 {{ formatarDataBrasileira(dataFiltro) }}
        </span>
        <span
          v-if="modelValue?.trim()"
          class="ml-2 px-2 py-1 bg-blue-100 rounded text-xs"
        >
          🔍 "{{ modelValue?.trim() }}"
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  dataFiltro: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
  "update:dataFiltro": [value: string];
  setToday: [];
  setYesterday: [];
  setThisWeek: [];
}>();

const formatarDataBrasileira = (data: string): string => {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};
</script>
