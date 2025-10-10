<template>
  <div>
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Entrada de Funcionário -->
        <div
          class="bg-white rounded-2xl shadow-medium p-8 border border-neutral-100"
        >
          <h2
            class="text-2xl font-semibold text-success-600 mb-6 flex items-center"
          >
            <ArrowRightOnRectangleIcon class="h-7 w-7 mr-3 text-success-500" />
            Entrada de Funcionário
          </h2>
          <form @submit.prevent="registrarEntrada" class="space-y-5">
            <BaseInput
              v-model="entradaForm.nome"
              label="Nome do Funcionário"
              placeholder="Digite o nome completo"
              :prefix-icon="UserIcon"
              required
              size="md"
            />

            <BaseInput
              v-model="entradaForm.cargo"
              label="Cargo/Setor"
              placeholder="Ex: Desenvolvedor, RH, Vendas"
              :prefix-icon="BriefcaseIcon"
              size="md"
            />

            <BaseButton
              type="submit"
              variant="success"
              size="lg"
              :icon="CheckIcon"
              full-width
            >
              Registrar Entrada
            </BaseButton>
          </form>
        </div>

        <!-- Saída de Funcionário -->
        <div
          class="bg-white rounded-2xl shadow-medium p-8 border border-neutral-100"
        >
          <h2
            class="text-2xl font-semibold text-danger-600 mb-6 flex items-center"
          >
            <ArrowLeftOnRectangleIcon class="h-7 w-7 mr-3 text-danger-500" />
            Saída de Funcionário
          </h2>
          <form @submit.prevent="registrarSaida" class="space-y-5">
            <div>
              <label
                class="block text-sm font-semibold text-secondary-700 mb-2"
              >
                Selecionar Funcionário
              </label>
              <Listbox v-model="saidaForm.funcionarioId">
                <div class="relative">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-xl bg-white py-3 pl-4 pr-12 text-left border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-danger-400 focus:border-danger-400 transition-colors duration-200"
                  >
                    <span
                      v-if="!saidaForm.funcionarioId"
                      class="block truncate text-neutral-400 font-medium"
                    >
                      Selecione um funcionário
                    </span>
                    <span
                      v-else
                      class="block truncate font-medium text-secondary-800"
                    >
                      {{ funcionarioSelecionado?.nome }} -
                      {{ funcionarioSelecionado?.cargo }}
                    </span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <ChevronUpDownIcon class="h-5 w-5 text-neutral-400" />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-strong ring-1 ring-black/5 focus:outline-none border border-neutral-100"
                    >
                      <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="funcionario in funcionariosPresentes"
                        :key="funcionario.id"
                        :value="funcionario.id"
                        as="template"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-danger-50 text-danger-900'
                              : 'text-secondary-900',
                            'relative cursor-default select-none py-3 pl-12 pr-4 transition-colors duration-150',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-semibold' : 'font-medium',
                              'block truncate',
                            ]"
                          >
                            {{ funcionario.nome }} - {{ funcionario.cargo }}
                          </span>
                          <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-4 text-danger-600"
                          >
                            <CheckIcon class="h-5 w-5" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
            <BaseButton
              type="submit"
              variant="danger"
              size="lg"
              :icon="XMarkIcon"
              :disabled="!saidaForm.funcionarioId"
              full-width
            >
              Registrar Saída
            </BaseButton>
          </form>
        </div>
      </div>

      <!-- Lista de Funcionários Presentes -->
      <div
        class="mt-10 bg-white rounded-2xl shadow-medium p-8 border border-neutral-100"
      >
        <h3
          class="text-2xl font-semibold text-secondary-800 mb-6 flex items-center"
        >
          <UsersIcon class="h-7 w-7 mr-3 text-primary-500" />
          Funcionários Presentes
          <span
            class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-800"
          >
            {{ funcionariosPresentes.length }}
          </span>
        </h3>
        <div
          v-if="funcionariosPresentes.length === 0"
          class="text-neutral-500 text-center py-12 flex flex-col items-center"
        >
          <UserGroupIcon class="h-16 w-16 text-neutral-300 mb-4" />
          <p class="text-lg font-medium">
            Nenhum funcionário presente no momento
          </p>
          <p class="text-sm mt-1">
            Os funcionários aparecerão aqui após registrar entrada
          </p>
        </div>
        <div v-else class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="funcionario in funcionariosPresentes"
            :key="funcionario.id"
            class="border-2 border-neutral-100 rounded-xl p-5 hover:shadow-medium transition-all duration-200 hover:border-primary-200 bg-gradient-to-br from-white to-neutral-50"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4
                  class="font-semibold text-secondary-800 flex items-center text-lg"
                >
                  <UserIcon class="h-5 w-5 mr-2 text-primary-500" />
                  {{ funcionario.nome }}
                </h4>
                <p class="text-secondary-600 flex items-center mt-2">
                  <BriefcaseIcon class="h-4 w-4 mr-2 text-neutral-400" />
                  {{ funcionario.cargo }}
                </p>
                <p class="text-neutral-500 mt-3 flex items-center text-sm">
                  <ClockIcon class="h-4 w-4 mr-2 text-neutral-400" />
                  Entrada: {{ formatarHora(funcionario.horaEntrada) }}
                </p>
              </div>
              <div class="ml-3 flex flex-col items-center">
                <div
                  class="w-3 h-3 bg-success-500 rounded-full animate-pulse shadow-soft"
                ></div>
                <span class="text-xs text-success-600 font-medium mt-1"
                  >Online</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Histórico do Dia -->
      <div
        class="mt-10 bg-white rounded-2xl shadow-medium p-8 border border-neutral-100"
      >
        <h3
          class="text-2xl font-semibold text-secondary-800 mb-6 flex items-center"
        >
          <DocumentTextIcon class="h-7 w-7 mr-3 text-primary-500" />
          Histórico do Dia
        </h3>
        <div
          v-if="historico.length === 0"
          class="text-neutral-500 text-center py-12 flex flex-col items-center"
        >
          <ClipboardDocumentListIcon class="h-16 w-16 text-neutral-300 mb-4" />
          <p class="text-lg font-medium">Nenhum registro hoje</p>
          <p class="text-sm mt-1">
            O histórico de entradas e saídas aparecerá aqui
          </p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="registro in historico"
            :key="registro.id"
            class="flex justify-between items-center py-4 px-6 rounded-xl border-l-4 transition-all duration-200 hover:shadow-soft"
            :class="
              registro.tipo === 'entrada'
                ? 'border-success-500 bg-gradient-to-r from-success-50 to-success-25'
                : 'border-danger-500 bg-gradient-to-r from-danger-50 to-danger-25'
            "
          >
            <div class="flex items-center space-x-4">
              <div
                class="flex-shrink-0 p-2 rounded-full"
                :class="
                  registro.tipo === 'entrada'
                    ? 'bg-success-100'
                    : 'bg-danger-100'
                "
              >
                <ArrowRightOnRectangleIcon
                  v-if="registro.tipo === 'entrada'"
                  class="h-6 w-6 text-success-600"
                />
                <ArrowLeftOnRectangleIcon
                  v-else
                  class="h-6 w-6 text-danger-600"
                />
              </div>
              <div>
                <span class="font-semibold text-secondary-900 text-lg">{{
                  registro.nome
                }}</span>
                <span class="text-secondary-600 ml-3 font-medium">{{
                  registro.cargo
                }}</span>
              </div>
            </div>
            <div class="text-right flex items-center space-x-4">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                :class="
                  registro.tipo === 'entrada'
                    ? 'bg-success-100 text-success-800 border border-success-200'
                    : 'bg-danger-100 text-danger-800 border border-danger-200'
                "
              >
                {{ registro.tipo.toUpperCase() }}
              </span>
              <div class="text-secondary-600 flex items-center font-medium">
                <ClockIcon class="h-4 w-4 mr-2 text-neutral-400" />
                {{ formatarHora(registro.hora) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  UsersIcon,
  UserGroupIcon,
  UserIcon,
  BriefcaseIcon,
  ClockIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/vue/24/outline";

// Imports explícitos dos componentes
import BaseButton from "~/components/BaseButton.vue";
import BaseInput from "~/components/BaseInput.vue";

// Estados reativos
const entradaForm = ref({
  nome: "",
  cargo: "",
});

const saidaForm = ref({
  funcionarioId: "",
});

const funcionarios = ref([]);
const historico = ref([]);

// Funcionários que estão presentes (entraram mas não saíram)
const funcionariosPresentes = computed(() => {
  return funcionarios.value.filter((f) => f.presente);
});

// Funcionário selecionado no formulário de saída
const funcionarioSelecionado = computed(() => {
  if (!saidaForm.value.funcionarioId) return null;
  return funcionarios.value.find(
    (f) => f.id === parseInt(saidaForm.value.funcionarioId)
  );
});

// Funções
const registrarEntrada = () => {
  if (!entradaForm.value.nome.trim()) return;

  const novoFuncionario = {
    id: Date.now(),
    nome: entradaForm.value.nome.trim(),
    cargo: entradaForm.value.cargo.trim() || "Não informado",
    horaEntrada: new Date(),
    presente: true,
  };

  funcionarios.value.push(novoFuncionario);

  // Adicionar ao histórico
  historico.value.unshift({
    id: Date.now() + 1,
    nome: novoFuncionario.nome,
    cargo: novoFuncionario.cargo,
    tipo: "entrada",
    hora: novoFuncionario.horaEntrada,
  });

  // Limpar formulário
  entradaForm.value = { nome: "", cargo: "" };

  // Feedback visual (pode ser melhorado com toast/notification)
  alert(`Entrada registrada para ${novoFuncionario.nome}`);
};

const registrarSaida = () => {
  const funcionarioId = parseInt(saidaForm.value.funcionarioId);
  const funcionario = funcionarios.value.find((f) => f.id === funcionarioId);

  if (!funcionario) return;

  // Marcar como não presente
  funcionario.presente = false;
  funcionario.horaSaida = new Date();

  // Adicionar ao histórico
  historico.value.unshift({
    id: Date.now(),
    nome: funcionario.nome,
    cargo: funcionario.cargo,
    tipo: "saida",
    hora: funcionario.horaSaida,
  });

  // Limpar seleção
  saidaForm.value.funcionarioId = "";

  // Feedback visual
  alert(`Saída registrada para ${funcionario.nome}`);
};

const formatarHora = (data) => {
  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Meta tags para SEO
useHead({
  title: "Sistema de Portaria - Controle de Acesso",
  meta: [
    {
      name: "description",
      content: "Sistema para controle de entrada e saída de funcionários",
    },
  ],
});
</script>
