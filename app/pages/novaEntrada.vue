<template>
  <div>
    <!-- Page Header -->
    <div
      class="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-8"
    >
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl font-bold mb-2">Nova Entrada</h1>
        <p class="text-primary-100">Página em Desenvolvimento</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div
        class="bg-white rounded-2xl shadow-medium p-8 border border-neutral-100 text-center"
      >
        <h2 class="text-2xl font-semibold text-secondary-800 mb-4">
          Página Nova Entrada
        </h2>
        <p class="text-neutral-600">
          Esta página está em desenvolvimento e será implementada em breve.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Meta tags para SEO
useHead({
  title: "Nova Entrada - Sistema de Portaria",
  meta: [
    {
      name: "description",
      content: "Página para nova entrada no sistema de portaria",
    },
  ],
});
</script>
