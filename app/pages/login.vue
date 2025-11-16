<template>
  <div>
    <!-- Background Pattern -->
    <div
      class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4"
    >
      <!-- Background Decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl"
        ></div>
        <div
          class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl"
        ></div>
      </div>

      <!-- Login Form Container -->
      <div class="relative z-10 w-full max-w-md">
        <FormsLoginForm />
      </div>
    </div>
  </div>
</template>

<script setup>
// Configuração da página
definePageMeta({
  middleware: "guest",
  layout: false, // Usar layout customizado para esta página
});

// Meta tags para SEO
useHead({
  title: "Login - Sistema de Portaria",
  meta: [
    {
      name: "description",
      content: "Faça login ou crie sua conta no Sistema de Portaria",
    },
  ],
});
</script>
