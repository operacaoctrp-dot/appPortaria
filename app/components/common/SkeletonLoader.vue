<template>
  <div class="space-y-4">
    <!-- Skeleton para os filtros -->
    <div v-if="loading" class="bg-white p-4 rounded-lg shadow-sm">
      <div class="flex gap-4">
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
          <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
          <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Skeleton para a tabela -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th v-for="col in colunas" :key="col" class="px-4 py-3 text-left">
              <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr v-for="i in linhas" :key="i">
            <td v-for="col in colunas" :key="col" class="px-4 py-3">
              <div class="h-6 bg-gray-100 rounded animate-pulse"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Conteúdo real -->
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  colunas: {
    type: Number,
    default: 10,
  },
  linhas: {
    type: Number,
    default: 5,
  },
});
</script>
