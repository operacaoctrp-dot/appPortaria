<template>
  <div class="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-semibold text-secondary-800">
          Lista de Colaboradores
        </h2>
        <p class="text-sm text-secondary-600 mt-1">
          Total: {{ totalColaboradores }} colaborador(es)
          <span v-if="filteredCount !== totalColaboradores">
            • Filtrados: {{ filteredCount }}
          </span>
        </p>
      </div>
      <div class="flex space-x-3">
        <BaseButton
          @click="$emit('exportExcel')"
          variant="outline"
          size="sm"
          :loading="exportingExcel"
        >
          📊 Excel
        </BaseButton>
        <BaseButton
          @click="$emit('exportPDF')"
          variant="outline"
          size="sm"
          :loading="exportingPDF"
        >
          📄 PDF
        </BaseButton>
        <BaseButton
          @click="$emit('refresh')"
          variant="primary"
          size="sm"
          :icon="ArrowPathIcon"
          :loading="loading"
        >
          Atualizar
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

defineProps<{
  totalColaboradores: number;
  filteredCount: number;
  loading?: boolean;
  exportingExcel?: boolean;
  exportingPDF?: boolean;
}>();

defineEmits<{
  exportExcel: [];
  exportPDF: [];
  refresh: [];
}>();
</script>
