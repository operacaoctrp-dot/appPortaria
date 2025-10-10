<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Card Container -->
    <div
      class="bg-white rounded-2xl shadow-strong p-8 border border-neutral-100"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center space-x-3 mb-4">
          <UserCircleIcon class="h-10 w-10 text-primary-500" />
          <h2 class="text-3xl font-bold text-secondary-800">
            Acesso ao Sistema
          </h2>
        </div>
        <p class="text-secondary-600">
          Entre ou crie sua conta para acessar o sistema
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex mb-6 bg-neutral-100 rounded-xl p-1">
        <button
          @click="activeTab = 'login'"
          :class="[
            'flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200',
            activeTab === 'login'
              ? 'bg-white text-primary-600 shadow-soft'
              : 'text-secondary-600 hover:text-secondary-800',
          ]"
        >
          Entrar
        </button>
        <button
          @click="activeTab = 'register'"
          :class="[
            'flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200',
            activeTab === 'register'
              ? 'bg-white text-primary-600 shadow-soft'
              : 'text-secondary-600 hover:text-secondary-800',
          ]"
        >
          Criar Conta
        </button>
      </div>

      <!-- Login Form -->
      <div v-if="activeTab === 'login'" class="space-y-6">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <BaseInput
            v-model="loginForm.email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            :prefix-icon="EnvelopeIcon"
            autocomplete="email"
            required
            size="md"
          />

          <BaseInput
            v-model="loginForm.password"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="current-password"
            required
            size="md"
          />

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :icon="ArrowRightOnRectangleIcon"
            full-width
          >
            Entrar no Sistema
          </BaseButton>
        </form>

        <!-- Forgot Password Link -->
        <div class="text-center">
          <a
            href="#"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            Esqueceu sua senha?
          </a>
        </div>
      </div>

      <!-- Register Form -->
      <div v-else-if="activeTab === 'register'" class="space-y-6">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <BaseInput
            v-model="registerForm.email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            :prefix-icon="EnvelopeIcon"
            autocomplete="email"
            required
            size="md"
          />

          <BaseInput
            v-model="registerForm.password"
            label="Senha"
            type="password"
            placeholder="Crie uma senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="new-password"
            required
            size="md"
          />

          <BaseInput
            v-model="registerForm.confirmPassword"
            label="Confirmar Senha"
            type="password"
            placeholder="Confirme sua senha"
            :prefix-icon="LockClosedIcon"
            autocomplete="new-password"
            required
            size="md"
          />

          <BaseButton
            type="submit"
            variant="success"
            size="lg"
            :icon="UserPlusIcon"
            full-width
          >
            Criar Conta
          </BaseButton>
        </form>
      </div>
    </div>

    <!-- Additional Info -->
    <div class="mt-6 text-center">
      <p class="text-sm text-secondary-500">
        Sistema seguro de controle de portaria
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/vue/24/outline";

// Imports explícitos dos componentes
import BaseInput from "~/components/BaseInput.vue";
import BaseButton from "~/components/BaseButton.vue";

// Estado das abas
const activeTab = ref("login");

// Formulário de login
const loginForm = ref({
  email: "",
  password: "",
});

// Formulário de registro
const registerForm = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

// Funções (vazias conforme solicitado)
const handleLogin = () => {
  // Função de login será implementada posteriormente
  console.log("Login form submitted:", loginForm.value);
};

const handleRegister = () => {
  // Função de registro será implementada posteriormente
  console.log("Register form submitted:", registerForm.value);
};
</script>
