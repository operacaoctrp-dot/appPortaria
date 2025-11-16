<template>
  <div class="bg-white rounded-xl shadow-sm border border-neutral-200">
    <!-- Header -->
    <div
      class="flex items-center justify-between p-4 border-b border-neutral-100"
    >
      <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
        <FunnelIcon class="h-5 w-5 mr-2 text-neutral-500" />
        Filtros
      </h3>

      <div class="flex items-center space-x-2">
        <!-- Indicador de filtros ativos -->
        <span
          v-if="activeFiltersCount > 0"
          class="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
        >
          {{ activeFiltersCount }}
          {{ activeFiltersCount === 1 ? "filtro" : "filtros" }}
        </span>

        <!-- Botão de colapsar -->
        <button
          @click="isCollapsed = !isCollapsed"
          class="p-1.5 text-neutral-500 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ChevronUpIcon
            class="h-4 w-4 transition-transform duration-200"
            :class="{ 'rotate-180': isCollapsed }"
          />
        </button>
      </div>
    </div>

    <!-- Filtros Content -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="!isCollapsed" class="p-4 space-y-4">
        <!-- Grid de Filtros -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <!-- Filtro de Nome -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              Nome
            </label>
            <div class="relative">
              <input
                v-model="localFilters.nome"
                type="text"
                placeholder="Buscar por nome..."
                class="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                @input="debouncedUpdate"
              />
              <MagnifyingGlassIcon
                class="absolute left-3 top-2.5 h-4 w-4 text-neutral-400"
              />
            </div>
          </div>

          <!-- Filtro de Função -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              Função/Cargo
            </label>
            <select
              v-model="localFilters.funcao"
              @change="updateFilters"
              class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas as funções</option>
              <option
                v-for="funcao in availableFuncoes"
                :key="funcao"
                :value="funcao"
              >
                {{ funcao }}
              </option>
            </select>
          </div>

          <!-- Filtro de Filial -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              Filial
            </label>
            <select
              v-model="localFilters.filial"
              @change="updateFilters"
              class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas as filiais</option>
              <option
                v-for="filial in availableFiliais"
                :key="filial"
                :value="filial"
              >
                {{ filial }}
              </option>
            </select>
          </div>

          <!-- Filtro de Status -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <select
              v-model="localFilters.status"
              @change="updateFilters"
              class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos</option>
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
            </select>
          </div>

          <!-- Filtro de Data Início -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              Data Início
            </label>
            <input
              v-model="localFilters.dataInicio"
              type="date"
              @change="updateFilters"
              class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <!-- Filtro de Data Fim -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              Data Fim
            </label>
            <input
              v-model="localFilters.dataFim"
              type="date"
              @change="updateFilters"
              class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <!-- Filtro de Matrícula -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              Matrícula
            </label>
            <input
              v-model.number="localFilters.matricula"
              type="number"
              placeholder="Número da matrícula"
              @input="debouncedUpdate"
              class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <!-- Filtros Rápidos -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              Filtros Rápidos
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                @click="setQuickFilter('hoje')"
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                  quickFilter === 'hoje'
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200',
                ]"
              >
                Hoje
              </button>

              <button
                @click="setQuickFilter('semana')"
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                  quickFilter === 'semana'
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200',
                ]"
              >
                Esta Semana
              </button>

              <button
                @click="setQuickFilter('mes')"
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                  quickFilter === 'mes'
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200',
                ]"
              >
                Este Mês
              </button>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div
          class="flex items-center justify-between pt-4 border-t border-neutral-100"
        >
          <div class="flex items-center space-x-2">
            <button
              @click="clearFilters"
              :disabled="activeFiltersCount === 0"
              class="px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Limpar Filtros
            </button>

            <button
              v-if="canSavePreset"
              @click="savePreset"
              class="px-3 py-1.5 text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              Salvar Filtro
            </button>
          </div>

          <div class="text-sm text-neutral-500">
            {{ totalResults }}
            {{ totalResults === 1 ? "resultado" : "resultados" }}
          </div>
        </div>

        <!-- Presets Salvos -->
        <div
          v-if="savedPresets.length > 0"
          class="pt-2 border-t border-neutral-100"
        >
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Filtros Salvos
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="preset in savedPresets"
              :key="preset.id"
              @click="loadPreset(preset)"
              class="px-3 py-1.5 text-xs bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors flex items-center group"
            >
              {{ preset.name }}
              <XMarkIcon
                @click.stop="removePreset(preset.id)"
                class="h-3 w-3 ml-2 text-neutral-400 group-hover:text-neutral-600 hover:text-red-500 transition-colors"
              />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  FunnelIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { debounce } from "lodash-es";

interface FilterData {
  nome?: string;
  funcao?: string;
  filial?: string;
  matricula?: number;
  dataInicio?: string;
  dataFim?: string;
  status?: string;
}

interface FilterPreset {
  id: string;
  name: string;
  filters: FilterData;
}

interface Props {
  filters: FilterData;
  availableFuncoes: string[];
  availableFiliais: string[];
  totalResults: number;
  savedPresets?: FilterPreset[];
}

const props = withDefaults(defineProps<Props>(), {
  savedPresets: () => [],
});

const emit = defineEmits<{
  "update:filters": [filters: FilterData];
  "save-preset": [name: string, filters: FilterData];
  "load-preset": [preset: FilterPreset];
  "remove-preset": [id: string];
}>();

const isCollapsed = ref(false);
const quickFilter = ref<string | null>(null);
const localFilters = ref<FilterData>({ ...props.filters });

const activeFiltersCount = computed(() => {
  return Object.values(localFilters.value).filter(
    (value) => value !== "" && value !== null && value !== undefined
  ).length;
});

const canSavePreset = computed(() => {
  return activeFiltersCount.value > 0;
});

const updateFilters = () => {
  emit("update:filters", { ...localFilters.value });
};

const debouncedUpdate = debounce(updateFilters, 300);

const clearFilters = () => {
  localFilters.value = {};
  quickFilter.value = null;
  updateFilters();
};

const setQuickFilter = (filter: string) => {
  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  quickFilter.value = filter;

  switch (filter) {
    case "hoje":
      localFilters.value.dataInicio = formatDate(today);
      localFilters.value.dataFim = formatDate(today);
      break;

    case "semana":
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      localFilters.value.dataInicio = formatDate(startOfWeek);
      localFilters.value.dataFim = formatDate(today);
      break;

    case "mes":
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      localFilters.value.dataInicio = formatDate(startOfMonth);
      localFilters.value.dataFim = formatDate(today);
      break;
  }

  updateFilters();
};

const savePreset = () => {
  const name = prompt("Nome para o filtro:");
  if (name) {
    emit("save-preset", name, { ...localFilters.value });
  }
};

const loadPreset = (preset: FilterPreset) => {
  localFilters.value = { ...preset.filters };
  emit("load-preset", preset);
  updateFilters();
};

const removePreset = (id: string) => {
  if (confirm("Deseja remover este filtro salvo?")) {
    emit("remove-preset", id);
  }
};

// Watch para sincronizar com props
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters };
  },
  { deep: true }
);
</script>
