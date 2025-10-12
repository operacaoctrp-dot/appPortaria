<template>
  <div>
    <!-- Cabeçalho com informações do usuário -->
    <div class="bg-white border-b border-neutral-200 mb-8">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-secondary-800">
              Sistema de Portaria
            </h1>
            <p class="text-secondary-600">Bem-vindo, {{ user?.email }}</p>
          </div>
          <BaseButton
            @click="handleLogout"
            variant="outline"
            size="sm"
            :icon="ArrowLeftOnRectangleIcon"
          >
            Sair
          </BaseButton>
        </div>
      </div>
    </div>

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
        <div
          v-else
          class="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div
            v-for="funcionario in funcionariosPresentes"
            :key="funcionario.id"
            class="border-2 border-neutral-100 rounded-lg p-3 hover:shadow-medium transition-all duration-200 hover:border-primary-200 bg-gradient-to-br from-white to-neutral-50"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4
                  class="font-semibold text-secondary-800 flex items-center text-base"
                >
                  <UserIcon class="h-4 w-4 mr-2 text-primary-500" />
                  {{ funcionario.nome }}
                </h4>
                <p class="text-secondary-600 flex items-center mt-1 text-sm">
                  <BriefcaseIcon class="h-3 w-3 mr-2 text-neutral-400" />
                  {{ funcionario.cargo }}
                </p>
                <p
                  v-if="funcionario.matricula"
                  class="text-neutral-500 mt-1 flex items-center text-xs"
                >
                  <DocumentTextIcon class="h-3 w-3 mr-2 text-neutral-400" />
                  Mat: {{ funcionario.matricula }}
                </p>
                <p
                  v-if="funcionario.filial"
                  class="text-neutral-500 mt-1 flex items-center text-xs"
                >
                  <UsersIcon class="h-3 w-3 mr-2 text-neutral-400" />
                  {{ funcionario.filial }}
                </p>
                <p class="text-neutral-500 mt-2 flex items-center text-xs">
                  <ClockIcon class="h-3 w-3 mr-2 text-neutral-400" />
                  {{ formatarHora(funcionario.horaEntrada) }}
                </p>
              </div>
              <div class="ml-2 flex flex-col items-center">
                <div
                  class="w-2 h-2 bg-success-500 rounded-full animate-pulse shadow-soft"
                ></div>
                <span class="text-xs text-success-600 font-medium mt-1"
                  >Online</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard de Histórico e Estatísticas -->
      <div
        class="mt-10 bg-white rounded-2xl shadow-medium border border-neutral-100 overflow-hidden"
      >
        <!-- Header com abas -->
        <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold text-white flex items-center">
              <DocumentTextIcon class="h-7 w-7 mr-3" />
              Centro de Controle
            </h3>
            <div class="flex space-x-2">
              <button
                v-for="(aba, index) in abasHistorico"
                :key="index"
                @click="abaAtiva = index"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                  abaAtiva === index
                    ? 'bg-white text-primary-600 shadow-md'
                    : 'text-primary-100 hover:text-white hover:bg-primary-400',
                ]"
              >
                {{ aba.nome }}
              </button>
            </div>
          </div>

          <!-- Estatísticas rápidas -->
          <div class="grid grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-3xl font-bold text-white">{{ totalHoje }}</div>
              <div class="text-primary-100 text-sm">Movimentações Hoje</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white">
                {{ funcionariosPresentes.length }}
              </div>
              <div class="text-primary-100 text-sm">Presentes Agora</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white">{{ picoHorario }}</div>
              <div class="text-primary-100 text-sm">Pico do Dia</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white">
                {{ tempoMedioPresenca }}
              </div>
              <div class="text-primary-100 text-sm">Tempo Médio</div>
            </div>
          </div>
        </div>

        <!-- Conteúdo das abas -->
        <div class="p-8">
          <!-- Aba Timeline -->
          <div v-if="abaAtiva === 0">
            <div class="flex justify-between items-center mb-6">
              <h4 class="text-xl font-semibold text-secondary-800">
                Timeline do Dia
              </h4>
              <div class="flex space-x-3">
                <select
                  v-model="filtroTipo"
                  class="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                >
                  <option value="">Todos os tipos</option>
                  <option value="entrada">Entradas</option>
                  <option value="saida">Saídas</option>
                </select>
                <input
                  v-model="filtroNome"
                  placeholder="Buscar funcionário..."
                  class="px-3 py-2 border border-neutral-300 rounded-lg text-sm w-48"
                />
              </div>
            </div>

            <div
              v-if="historicoFiltrado.length === 0"
              class="text-center py-12"
            >
              <ClipboardDocumentListIcon
                class="h-16 w-16 text-neutral-300 mb-4 mx-auto"
              />
              <p class="text-lg font-medium text-neutral-500">
                Nenhum registro encontrado
              </p>
              <p class="text-sm text-neutral-400 mt-1">
                Os registros aparecerão aqui conforme as movimentações
              </p>
            </div>

            <!-- Timeline visual -->
            <div v-else class="relative">
              <!-- Linha central -->
              <div
                class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-200"
              ></div>

              <div class="space-y-6">
                <div
                  v-for="(registro, index) in historicoFiltrado"
                  :key="registro.id"
                  class="relative flex items-center group"
                >
                  <!-- Marcador na timeline -->
                  <div
                    :class="[
                      'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-125',
                      registro.tipo === 'entrada'
                        ? 'bg-gradient-to-br from-success-400 to-success-600'
                        : 'bg-gradient-to-br from-danger-400 to-danger-600',
                    ]"
                  >
                    <ArrowRightOnRectangleIcon
                      v-if="registro.tipo === 'entrada'"
                      class="h-4 w-4 text-white"
                    />
                    <ArrowLeftOnRectangleIcon
                      v-else
                      class="h-4 w-4 text-white"
                    />
                  </div>

                  <!-- Card do registro -->
                  <div
                    :class="[
                      'ml-6 flex-1 p-4 rounded-xl border-l-4 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1',
                      registro.tipo === 'entrada'
                        ? 'border-success-500 bg-gradient-to-r from-success-50 to-white'
                        : 'border-danger-500 bg-gradient-to-r from-danger-50 to-white',
                    ]"
                  >
                    <div class="flex justify-between items-start">
                      <div>
                        <h5 class="font-bold text-secondary-900 text-lg">
                          {{ registro.nome }}
                        </h5>
                        <p class="text-secondary-600 font-medium">
                          {{ registro.cargo }}
                        </p>
                        <div class="flex items-center mt-2 space-x-4">
                          <span
                            :class="[
                              'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                              registro.tipo === 'entrada'
                                ? 'bg-success-100 text-success-700 border border-success-200'
                                : 'bg-danger-100 text-danger-700 border border-danger-200',
                            ]"
                          >
                            {{ registro.tipo }}
                          </span>
                          <span class="text-neutral-500 text-sm">{{
                            calcularTempoRelativo(registro.hora)
                          }}</span>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-2xl font-bold text-secondary-800">
                          {{ formatarHora(registro.hora) }}
                        </div>
                        <div class="text-sm text-neutral-500">
                          {{ formatarDataCompleta(registro.hora) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Aba Estatísticas -->
          <div v-if="abaAtiva === 1">
            <h4 class="text-xl font-semibold text-secondary-800 mb-6">
              Métricas e Análises
            </h4>

            <!-- Cards de métricas -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
              >
                <div class="flex items-center">
                  <div class="p-3 bg-blue-500 rounded-lg">
                    <ArrowRightOnRectangleIcon class="h-6 w-6 text-white" />
                  </div>
                  <div class="ml-4">
                    <div class="text-2xl font-bold text-blue-700">
                      {{ entradasHoje }}
                    </div>
                    <div class="text-blue-600 text-sm">Entradas Hoje</div>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
              >
                <div class="flex items-center">
                  <div class="p-3 bg-purple-500 rounded-lg">
                    <ArrowLeftOnRectangleIcon class="h-6 w-6 text-white" />
                  </div>
                  <div class="ml-4">
                    <div class="text-2xl font-bold text-purple-700">
                      {{ saidasHoje }}
                    </div>
                    <div class="text-purple-600 text-sm">Saídas Hoje</div>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
              >
                <div class="flex items-center">
                  <div class="p-3 bg-green-500 rounded-lg">
                    <UsersIcon class="h-6 w-6 text-white" />
                  </div>
                  <div class="ml-4">
                    <div class="text-2xl font-bold text-green-700">
                      {{ funcionariosUnicos }}
                    </div>
                    <div class="text-green-600 text-sm">
                      Funcionários Ativos
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200"
              >
                <div class="flex items-center">
                  <div class="p-3 bg-orange-500 rounded-lg">
                    <ClockIcon class="h-6 w-6 text-white" />
                  </div>
                  <div class="ml-4">
                    <div class="text-2xl font-bold text-orange-700">
                      {{ horasTrabalhadasHoje }}
                    </div>
                    <div class="text-orange-600 text-sm">Horas Trabalhadas</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gráfico de barras simples -->
            <div class="bg-neutral-50 rounded-xl p-6 mb-6">
              <h5 class="font-semibold text-secondary-800 mb-4">
                Movimentação por Hora
              </h5>
              <div class="flex items-end space-x-2 h-40">
                <div
                  v-for="hora in graficoHoras"
                  :key="hora.label"
                  class="flex-1 flex flex-col items-center"
                >
                  <div
                    class="bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-500 hover:from-primary-600 hover:to-primary-500"
                    :style="{
                      height: `${(hora.count / maxMovimentacoes) * 100}%`,
                      minHeight: '4px',
                    }"
                  ></div>
                  <div class="text-xs text-neutral-600 mt-2">
                    {{ hora.label }}h
                  </div>
                </div>
              </div>
            </div>

            <!-- Top funcionários -->
            <div
              class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6"
            >
              <h5 class="font-semibold text-indigo-800 mb-4">
                🏆 Top Funcionários do Dia
              </h5>
              <div class="space-y-3">
                <div
                  v-for="(funcionario, index) in topFuncionarios"
                  :key="funcionario.nome"
                  class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                >
                  <div class="flex items-center">
                    <div
                      :class="[
                        'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                        index === 0
                          ? 'bg-yellow-500'
                          : index === 1
                          ? 'bg-gray-400'
                          : index === 2
                          ? 'bg-amber-600'
                          : 'bg-indigo-500',
                      ]"
                    >
                      {{ index + 1 }}
                    </div>
                    <div class="ml-3">
                      <div class="font-medium text-secondary-800">
                        {{ funcionario.nome }}
                      </div>
                      <div class="text-sm text-secondary-600">
                        {{ funcionario.cargo }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-indigo-700">
                      {{ funcionario.movimentacoes }}
                    </div>
                    <div class="text-xs text-indigo-600">movimentações</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Aba Relatórios -->
          <div v-if="abaAtiva === 2">
            <div class="flex justify-between items-center mb-6">
              <h4 class="text-xl font-semibold text-secondary-800">
                Relatórios e Exportação
              </h4>
              <div class="flex space-x-3">
                <BaseButton variant="outline" size="sm">
                  📊 Exportar Excel
                </BaseButton>
                <BaseButton variant="outline" size="sm">
                  📄 Gerar PDF
                </BaseButton>
                <BaseButton variant="primary" size="sm">
                  📧 Enviar Email
                </BaseButton>
              </div>
            </div>

            <!-- Resumo do período -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div
                class="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200"
              >
                <h5 class="font-semibold text-teal-800 mb-3">
                  📅 Período Analisado
                </h5>
                <div class="text-2xl font-bold text-teal-700">Hoje</div>
                <div class="text-teal-600 text-sm">
                  {{ formatarDataCompleta(new Date()) }}
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200"
              >
                <h5 class="font-semibold text-pink-800 mb-3">
                  ⚡ Horário de Pico
                </h5>
                <div class="text-2xl font-bold text-pink-700">
                  {{ horarioPico }}
                </div>
                <div class="text-pink-600 text-sm">Maior movimentação</div>
              </div>

              <div
                class="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200"
              >
                <h5 class="font-semibold text-cyan-800 mb-3">📈 Eficiência</h5>
                <div class="text-2xl font-bold text-cyan-700">
                  {{ eficienciaPortaria }}%
                </div>
                <div class="text-cyan-600 text-sm">Taxa de processamento</div>
              </div>
            </div>

            <!-- Lista detalhada para relatório -->
            <div
              class="bg-white border border-neutral-200 rounded-xl overflow-hidden"
            >
              <div class="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
                <h5 class="font-semibold text-secondary-800">
                  Registro Detalhado
                </h5>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <table class="w-full">
                  <thead class="bg-neutral-50 sticky top-0">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase"
                      >
                        Horário
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase"
                      >
                        Funcionário
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase"
                      >
                        Cargo
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase"
                      >
                        Tipo
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-neutral-200">
                    <tr
                      v-for="registro in historico"
                      :key="registro.id"
                      class="hover:bg-neutral-50"
                    >
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900"
                      >
                        {{ formatarHora(registro.hora) }}
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-secondary-800"
                      >
                        {{ registro.nome }}
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600"
                      >
                        {{ registro.cargo }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            registro.tipo === 'entrada'
                              ? 'bg-success-100 text-success-800'
                              : 'bg-danger-100 text-danger-800',
                          ]"
                        >
                          {{
                            registro.tipo.charAt(0).toUpperCase() +
                            registro.tipo.slice(1)
                          }}
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600"
                      >
                        ✅ Processado
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Aplicar middleware de autenticação
definePageMeta({
  middleware: "auth",
});

// Composable de autenticação
const { user, logout } = useAuth();

// Composable para gerenciar colaboradores
const {
  colaboradores,
  buscarColaboradores,
  registrarEntrada: registrarEntradaComposable,
  registrarSaida: registrarSaidaComposable,
  loading: loadingColaboradores,
} = useColaboradores();

// Funções de autenticação
const handleLogout = async () => {
  await logout();
  // Redirecionar para a página de login após logout
  await navigateTo("/login");
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

const historico = computed(() => {
  const registros = [];

  colaboradores.value.forEach((colaborador) => {
    // Processar entradas e saídas de cada colaborador
    for (let i = 1; i <= 5; i++) {
      const entrada = colaborador[`ent${i}`];
      const saida = colaborador[`sai${i}`];

      // Adicionar entrada se existir
      if (entrada) {
        registros.push({
          id: `${colaborador.id}-ent${i}`,
          nome: colaborador.nome || "Sem nome",
          cargo: colaborador.funcao || "Não informado",
          tipo: "entrada",
          hora: new Date(entrada),
          colaboradorId: colaborador.id,
          slot: i,
        });
      }

      // Adicionar saída se existir
      if (saida) {
        registros.push({
          id: `${colaborador.id}-sai${i}`,
          nome: colaborador.nome || "Sem nome",
          cargo: colaborador.funcao || "Não informado",
          tipo: "saida",
          hora: new Date(saida),
          colaboradorId: colaborador.id,
          slot: i,
        });
      }
    }
  });

  // Filtrar apenas registros de hoje
  const hoje = new Date();
  const inicioHoje = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate()
  );
  const fimHoje = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate() + 1
  );

  return registros
    .filter(
      (registro) => registro.hora >= inicioHoje && registro.hora < fimHoje
    )
    .sort((a, b) => new Date(b.hora) - new Date(a.hora)); // Mais recente primeiro
});

// Estados para o dashboard
const abaAtiva = ref(0);
const filtroTipo = ref("");
const filtroNome = ref("");

// Configuração das abas
const abasHistorico = [
  { nome: "🕒 Timeline", icone: "timeline" },
  { nome: "📊 Estatísticas", icone: "stats" },
  { nome: "📋 Relatórios", icone: "reports" },
];

// Funcionários que estão presentes (têm entrada sem saída correspondente)
const funcionariosPresentes = computed(() => {
  return colaboradores.value
    .filter((colaborador) => {
      // Verificar se tem alguma entrada sem saída correspondente
      for (let i = 1; i <= 5; i++) {
        const entrada = colaborador[`ent${i}`];
        const saida = colaborador[`sai${i}`];

        // Se tem entrada mas não tem saída correspondente, está presente
        if (entrada && !saida) {
          return true;
        }
      }
      return false;
    })
    .map((colaborador) => {
      // Encontrar a última entrada sem saída
      let ultimaEntrada = null;
      for (let i = 5; i >= 1; i--) {
        const entrada = colaborador[`ent${i}`];
        const saida = colaborador[`sai${i}`];

        if (entrada && !saida) {
          ultimaEntrada = entrada;
          break;
        }
      }

      return {
        id: colaborador.id,
        nome: colaborador.nome,
        cargo: colaborador.funcao || "Não informado",
        horaEntrada: ultimaEntrada ? new Date(ultimaEntrada) : new Date(),
        matricula: colaborador.matricula,
        filial: colaborador.filial,
      };
    });
});

// Funcionário selecionado no formulário de saída
const funcionarioSelecionado = computed(() => {
  if (!saidaForm.value.funcionarioId) return null;
  return funcionariosPresentes.value.find(
    (f) => f.id === parseInt(saidaForm.value.funcionarioId)
  );
});

// Computed properties para o dashboard
const historicoFiltrado = computed(() => {
  let resultado = historico.value;

  if (filtroTipo.value) {
    resultado = resultado.filter((r) => r.tipo === filtroTipo.value);
  }

  if (filtroNome.value.trim()) {
    const termo = filtroNome.value.toLowerCase().trim();
    resultado = resultado.filter(
      (r) =>
        r.nome.toLowerCase().includes(termo) ||
        r.cargo.toLowerCase().includes(termo)
    );
  }

  return resultado.sort((a, b) => new Date(b.hora) - new Date(a.hora));
});

const totalHoje = computed(() => historico.value.length);

const entradasHoje = computed(
  () => historico.value.filter((r) => r.tipo === "entrada").length
);

const saidasHoje = computed(
  () => historico.value.filter((r) => r.tipo === "saida").length
);

const funcionariosUnicos = computed(() => {
  const nomes = new Set(historico.value.map((r) => r.nome));
  return nomes.size;
});

const picoHorario = computed(() => {
  const horas = {};
  historico.value.forEach((r) => {
    const hora = new Date(r.hora).getHours();
    horas[hora] = (horas[hora] || 0) + 1;
  });

  const maiorMovimentacao = Math.max(...Object.values(horas), 0);
  const horaPico = Object.keys(horas).find(
    (h) => horas[h] === maiorMovimentacao
  );

  return horaPico ? `${horaPico}:00` : "N/A";
});

const tempoMedioPresenca = computed(() => {
  if (funcionariosPresentes.value.length === 0) return "0h";

  const agora = new Date();
  const tempos = funcionariosPresentes.value.map((f) => {
    const entrada = new Date(f.horaEntrada);
    return Math.abs(agora - entrada) / (1000 * 60 * 60); // horas
  });

  const media = tempos.reduce((a, b) => a + b, 0) / tempos.length;
  return `${Math.round(media)}h`;
});

const horasTrabalhadasHoje = computed(() => {
  // Calcular baseado nas movimentações do dia
  const entradas = historico.value.filter((r) => r.tipo === "entrada");
  const saidas = historico.value.filter((r) => r.tipo === "saida");

  let totalHoras = 0;
  entradas.forEach((entrada) => {
    const saidaCorrespondente = saidas.find((s) => s.nome === entrada.nome);
    if (saidaCorrespondente) {
      const horasTrabalho =
        Math.abs(new Date(saidaCorrespondente.hora) - new Date(entrada.hora)) /
        (1000 * 60 * 60);
      totalHoras += horasTrabalho;
    }
  });

  return Math.round(totalHoras);
});

const graficoHoras = computed(() => {
  const horas = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    count: 0,
  }));

  historico.value.forEach((r) => {
    const hora = new Date(r.hora).getHours();
    horas[hora].count++;
  });

  return horas.filter((h) => h.count > 0);
});

const maxMovimentacoes = computed(() =>
  Math.max(...graficoHoras.value.map((h) => h.count), 1)
);

const topFuncionarios = computed(() => {
  const contadores = {};

  historico.value.forEach((r) => {
    if (!contadores[r.nome]) {
      contadores[r.nome] = {
        nome: r.nome,
        cargo: r.cargo,
        movimentacoes: 0,
      };
    }
    contadores[r.nome].movimentacoes++;
  });

  return Object.values(contadores)
    .sort((a, b) => b.movimentacoes - a.movimentacoes)
    .slice(0, 5);
});

const horarioPico = computed(() => picoHorario.value);

const eficienciaPortaria = computed(() => {
  // Simular eficiência baseada na rapidez dos registros
  const tempoMedioRegistro = 2; // minutos
  const eficiencia = Math.min(100, Math.max(0, 100 - tempoMedioRegistro * 10));
  return Math.round(eficiencia);
});

// Funções
const registrarEntrada = async () => {
  if (!entradaForm.value.nome.trim()) return;

  try {
    const nome = entradaForm.value.nome.trim();
    const cargo = entradaForm.value.cargo.trim();

    await registrarEntradaComposable(nome, cargo);

    // Limpar formulário
    entradaForm.value = { nome: "", cargo: "" };

    // Feedback visual
    alert(`Entrada registrada para ${nome}`);
  } catch (err) {
    console.error("Erro ao registrar entrada:", err);
    alert(`Erro ao registrar entrada: ${err.message}`);
  }
};

const registrarSaida = async () => {
  const funcionarioId = parseInt(saidaForm.value.funcionarioId);
  const funcionario = funcionariosPresentes.value.find(
    (f) => f.id === funcionarioId
  );

  if (!funcionario) return;

  try {
    await registrarSaidaComposable(funcionarioId);

    // Limpar seleção
    saidaForm.value.funcionarioId = "";

    // Feedback visual
    alert(`Saída registrada para ${funcionario.nome}`);
  } catch (err) {
    console.error("Erro ao registrar saída:", err);
    alert(`Erro ao registrar saída: ${err.message}`);
  }
};

// Funções auxiliares para o dashboard
const calcularTempoRelativo = (data) => {
  const agora = new Date();
  const registro = new Date(data);
  const diferencaMs = agora - registro;
  const diferencaMinutos = Math.floor(diferencaMs / (1000 * 60));

  if (diferencaMinutos < 1) return "Agora";
  if (diferencaMinutos < 60) return `${diferencaMinutos}m atrás`;

  const diferencaHoras = Math.floor(diferencaMinutos / 60);
  if (diferencaHoras < 24) return `${diferencaHoras}h atrás`;

  const diferencaDias = Math.floor(diferencaHoras / 24);
  return `${diferencaDias}d atrás`;
};

const formatarDataCompleta = (data) => {
  const date = new Date(data);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatarHora = (data) => {
  if (!data) return "-";

  try {
    const date = new Date(data);
    // Usar UTC para evitar conversão de timezone, já que o banco armazena correto
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "-";
  }
};

// Carregar dados na inicialização
onMounted(async () => {
  try {
    await buscarColaboradores();
  } catch (err) {
    console.error("Erro ao carregar colaboradores:", err);
  }
});

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
