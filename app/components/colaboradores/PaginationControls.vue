<template>
  <div class="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Informação da página -->
      <div class="text-sm text-secondary-600">
        Mostrando
        <span class="font-medium">{{ pageInfo.start }}</span>
        a
        <span class="font-medium">{{ pageInfo.end }}</span>
        de
        <span class="font-medium">{{ pageInfo.total }}</span>
        resultados
      </div>

      <!-- Controles de paginação -->
      <div class="flex items-center gap-2">
        <!-- Primeira página -->
        <button
          @click="$emit('firstPage')"
          :disabled="!canGoPrevious"
          class="px-2 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Primeira página"
        >
          ⏮
        </button>

        <!-- Página anterior -->
        <button
          @click="$emit('previousPage')"
          :disabled="!canGoPrevious"
          class="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <!-- Números das páginas -->
        <div class="flex gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="$emit('goToPage', page)"
            :class="[
              'px-3 py-1 text-sm border rounded',
              page === currentPage
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-neutral-300 hover:bg-neutral-100',
            ]"
          >
            {{ page }}
          </button>
        </div>

        <!-- Próxima página -->
        <button
          @click="$emit('nextPage')"
          :disabled="!canGoNext"
          class="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </button>

        <!-- Última página -->
        <button
          @click="$emit('lastPage')"
          :disabled="!canGoNext"
          class="px-2 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Última página"
        >
          ⏭
        </button>
      </div>

      <!-- Seletor de itens por página -->
      <div class="flex items-center gap-2">
        <label for="pageSize" class="text-sm text-secondary-600">
          Itens por página:
        </label>
        <select
          id="pageSize"
          :value="pageSize"
          @change="
            $emit(
              'setPageSize',
              Number(($event.target as HTMLSelectElement).value)
            )
          "
          class="px-3 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option
            v-for="option in pageSizeOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PageInfo {
  start: number;
  end: number;
  total: number;
}

defineProps<{
  currentPage: number;
  pageSize: number;
  totalPages: number;
  pageInfo: PageInfo;
  canGoNext: boolean;
  canGoPrevious: boolean;
  visiblePages: number[];
  pageSizeOptions: number[];
}>();

defineEmits<{
  goToPage: [page: number];
  nextPage: [];
  previousPage: [];
  firstPage: [];
  lastPage: [];
  setPageSize: [size: number];
}>();
</script>
