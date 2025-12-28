<template>
  <div class="relative">
    <!-- Modo bloqueado com ícone de edição -->
    <div v-if="!isEditing" class="flex items-center gap-2">
      <span
        :class="[
          'flex-1 truncate',
          value ? 'text-xs text-neutral-700' : 'text-xs text-neutral-300',
        ]"
      >
        {{ value || placeholder }}
      </span>
      <button
        @click="iniciarEdicao"
        type="button"
        class="p-1 hover:bg-gray-100 rounded transition-colors"
        :title="`Editar ${label}`"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-neutral-400 hover:text-primary-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </button>
    </div>

    <!-- Modo de edição -->
    <div v-else>
      <input
        v-if="tipo === 'text'"
        ref="inputRef"
        v-model="tempValue"
        :type="tipo"
        :placeholder="placeholder"
        :class="[
          'text-xs border rounded px-2 py-1 w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          hasError ? 'border-red-500' : 'border-primary-300',
        ]"
        @blur="salvar"
        @keydown.enter="salvar"
        @keydown.esc="cancelar"
        @keydown.tab="salvar"
      />
      <select
        v-else-if="tipo === 'select'"
        ref="inputRef"
        v-model="tempValue"
        :class="[
          'text-xs border rounded px-2 py-1 w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          hasError ? 'border-red-500' : 'border-primary-300',
        ]"
        @blur="salvar"
        @keydown.enter="salvar"
        @keydown.esc="cancelar"
        @keydown.tab="salvar"
      >
        <option value="">{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt" :value="opt">
          {{ opt }}
        </option>
      </select>
      <div v-if="hasError" class="text-xs text-red-600 mt-1">
        Campo obrigatório
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

const props = defineProps({
  colaboradorId: {
    type: [String, Number],
    required: true,
  },
  campo: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  tipo: {
    type: String,
    default: "text",
    validator: (value) => ["text", "select"].includes(value),
  },
  options: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save"]);

const isEditing = ref(false);
const tempValue = ref("");
const inputRef = ref(null);
const hasError = ref(false);

const iniciarEdicao = () => {
  isEditing.value = true;
  tempValue.value = props.value || "";
  hasError.value = false;

  nextTick(() => {
    inputRef.value?.focus();
    if (props.tipo === "text") {
      inputRef.value?.select();
    }
  });
};

const salvar = () => {
  // Validar campo obrigatório
  if (props.required && !tempValue.value.trim()) {
    hasError.value = true;
    return;
  }

  isEditing.value = false;
  hasError.value = false;

  // Só emitir se o valor mudou
  if (tempValue.value !== props.value) {
    emit("save", {
      colaboradorId: props.colaboradorId,
      campo: props.campo,
      valor: tempValue.value.trim(),
    });
  }
};

const cancelar = () => {
  isEditing.value = false;
  tempValue.value = "";
  hasError.value = false;
};
</script>
