<template>
  <div>
    <!-- Modo de edição -->
    <div v-if="isEditing">
      <input
        ref="inputRef"
        v-model="tempValue"
        type="time"
        :class="[
          'text-xs border rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          hasError ? 'border-red-500' : 'border-primary-300',
        ]"
        @blur="salvar"
        @keydown.enter="salvar"
        @keydown.esc="cancelar"
        @keydown.tab="salvar"
      />
      <div v-if="hasError" class="text-xs text-red-600 mt-1">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Modo de visualização -->
    <div
      v-else
      @dblclick="iniciarEdicao"
      :class="[
        'rounded px-2 py-1 transition-colors',
        canEdit
          ? 'cursor-pointer hover:bg-gray-50'
          : 'cursor-not-allowed opacity-50',
      ]"
      :title="canEdit ? 'Duplo clique para editar' : tooltip"
    >
      <span
        v-if="valor"
        :class="[
          'inline-flex items-center px-2 py-1 rounded-md text-xs',
          tipo === 'entrada'
            ? 'bg-success-100 text-success-700'
            : 'bg-danger-100 text-danger-700',
        ]"
      >
        {{ formatarHora(valor) }}
      </span>
      <span v-else class="text-xs text-neutral-300">--:--</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";

const props = defineProps({
  colaboradorId: {
    type: [String, Number],
    required: true,
  },
  campo: {
    type: String,
    required: true,
  },
  valor: {
    type: String,
    default: null,
  },
  tipo: {
    type: String,
    default: "entrada",
    validator: (value) => ["entrada", "saida"].includes(value),
  },
  canEdit: {
    type: Boolean,
    default: true,
  },
  tooltip: {
    type: String,
    default: "Preencha Nome e Empresa primeiro",
  },
  // Para validação de saída após entrada
  entradaCorrespondente: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["save"]);

const isEditing = ref(false);
const tempValue = ref("");
const inputRef = ref(null);
const hasError = ref(false);
const errorMessage = ref("");

const iniciarEdicao = () => {
  if (!props.canEdit) return;

  isEditing.value = true;
  tempValue.value = timestampParaHora(props.valor);
  hasError.value = false;
  errorMessage.value = "";

  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
};

const validarHorario = (horario) => {
  if (!horario || horario.trim() === "") return true;

  const [horas, minutos] = horario.split(":").map(Number);

  // Validar formato
  if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
    hasError.value = true;
    errorMessage.value = "Horário inválido";
    return false;
  }

  // Se for saída, validar se é depois da entrada
  if (props.tipo === "saida" && props.entradaCorrespondente) {
    const entradaHorario = timestampParaHora(props.entradaCorrespondente);
    if (entradaHorario && horario < entradaHorario) {
      hasError.value = true;
      errorMessage.value = "Saída antes da entrada";
      return false;
    }
  }

  return true;
};

const salvar = async () => {
  if (!validarHorario(tempValue.value)) {
    return;
  }

  isEditing.value = false;
  hasError.value = false;
  errorMessage.value = "";

  emit("save", {
    colaboradorId: props.colaboradorId,
    campo: props.campo,
    valor: tempValue.value,
  });
};

const cancelar = () => {
  isEditing.value = false;
  tempValue.value = "";
  hasError.value = false;
  errorMessage.value = "";
};

const formatarHora = (data) => {
  if (!data) return "";

  try {
    const date = new Date(data);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    return "";
  }
};

const timestampParaHora = (timestamp) => {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    return "";
  }
};
</script>
