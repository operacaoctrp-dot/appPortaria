<template>
  <div class="overflow-x-auto">
    <div class="min-w-max">
      <table class="w-full divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Matrícula
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Nome
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Função
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Filial
            </th>
            <!-- Entradas e Saídas -->
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Ent1
            </th>
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Sai1
            </th>
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Ent2
            </th>
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Sai2
            </th>
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Ent3
            </th>
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Sai3
            </th>
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Ent4
            </th>
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Sai4
            </th>
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Ent5
            </th>
            <th
              class="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider"
            >
              Sai5
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <slot />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente wrapper para a tabela
</script>
