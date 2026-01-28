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
    <div class="container mx-auto px-4 py-6">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Entrada de Funcionário -->
        <div
          class="bg-white rounded-xl shadow-md p-5 border border-neutral-100"
        >
          <h2
            class="text-lg font-semibold text-success-600 mb-3 flex items-center"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5 mr-2 text-success-500" />
            Entrada de Funcionário
          </h2>
          <form @submit.prevent="registrarEntrada" class="space-y-3">
            <!-- Seletor de Aba -->
            <div>
              <label
                class="block text-sm font-semibold text-secondary-700 mb-1.5"
              >
                Tipo de Registro
              </label>
              <Listbox v-model="entradaForm.tipoAba">
                <div class="relative">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-success-400 focus:border-success-400 transition-colors text-sm"
                  >
                    <span class="block truncate font-medium text-secondary-800">
                      {{ entradaForm.tipoAba || 'Selecione o tipo' }}
                    </span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ChevronUpDownIcon class="h-4 w-4 text-neutral-400" />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none border border-neutral-100"
                    >
                      <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="tipo in tiposAba"
                        :key="tipo"
                        :value="tipo"
                        as="template"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-success-50 text-success-900'
                              : 'text-secondary-900',
                            'relative cursor-default select-none py-2 pl-9 pr-4 transition-colors',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-semibold' : 'font-medium',
                              'block truncate',
                            ]"
                          >
                            {{ tipo }}
                          </span>
                          <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-2 text-success-600"
                          >
                            <CheckIcon class="h-4 w-4" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>

            <!-- Campos dinâmicos baseados no tipo -->
            <div v-if="entradaForm.tipoAba" class="space-y-3">
              <!-- Incinerador -->
              <template v-if="entradaForm.tipoAba === 'Incinerador'">
                <BaseInput
                  v-model="entradaForm.matricula"
                  label="Matrícula"
                  placeholder="Digite a matrícula"
                  size="sm"
                  required
                />
                <BaseInput
                  v-model="entradaForm.nome"
                  label="Nome do Funcionário"
                  placeholder="Digite o nome completo"
                  :prefix-icon="UserIcon"
                  size="sm"
                  required
                />
                <BaseInput
                  v-model="entradaForm.funcao"
                  label="Função"
                  placeholder="Ex: Operador, Técnico"
                  :prefix-icon="BriefcaseIcon"
                  size="sm"
                />
                <BaseInput
                  v-model="entradaForm.filial"
                  label="Filial"
                  placeholder="Ex: ECOFOR"
                  size="sm"
                />
              </template>

              <!-- SFL -->
              <template v-if="entradaForm.tipoAba === 'SFL'">
                <BaseInput
                  v-model="entradaForm.matricula"
                  label="Matrícula"
                  placeholder="Digite a matrícula"
                  size="sm"
                  required
                />
                <BaseInput
                  v-model="entradaForm.nome"
                  label="Nome do Funcionário"
                  placeholder="Digite o nome completo"
                  :prefix-icon="UserIcon"
                  size="sm"
                  required
                />
                <BaseInput
                  v-model="entradaForm.funcao"
                  label="Função"
                  placeholder="Ex: Fiscal, Auxiliar"
                  :prefix-icon="BriefcaseIcon"
                  size="sm"
                />
                <BaseInput
                  v-model="entradaForm.filial"
                  label="Filial"
                  placeholder="Ex: CFL"
                  size="sm"
                />
              </template>

              <!-- Transportadoras -->
              <template v-if="entradaForm.tipoAba === 'Transportadoras'">
                <BaseInput
                  v-model="entradaForm.nome"
                  label="Nome do Motorista"
                  placeholder="Digite o nome completo"
                  :prefix-icon="UserIcon"
                  size="sm"
                  required
                />
                <BaseInput
                  v-model="entradaForm.funcao"
                  label="Função"
                  placeholder="Ex: Motorista, Ajudante"
                  :prefix-icon="BriefcaseIcon"
                  size="sm"
                />
                <BaseInput
                  v-model="entradaForm.empresa"
                  label="Empresa"
                  placeholder="Nome da transportadora"
                  size="sm"
                  required
                />
              </template>

              <!-- Visitantes -->
              <template v-if="entradaForm.tipoAba === 'Visitantes'">
                <BaseInput
                  v-model="entradaForm.rg"
                  label="RG"
                  placeholder="Digite o RG"
                  size="sm"
                  required
                />
                <BaseInput
                  v-model="entradaForm.nome"
                  label="Nome do Visitante"
                  placeholder="Digite o nome completo"
                  :prefix-icon="UserIcon"
                  size="sm"
                  required
                />
                <BaseInput
                  v-model="entradaForm.empresa"
                  label="Empresa"
                  placeholder="Nome da empresa"
                  size="sm"
                  required
                />
                <BaseInput
                  v-model="entradaForm.autorizacao"
                  label="Autorização"
                  placeholder="Quem autorizou a visita"
                  size="sm"
                />
              </template>
            </div>

            <BaseButton
              type="submit"
              variant="success"
              size="sm"
              :icon="CheckIcon"
              full-width
              :disabled="!entradaForm.tipoAba"
            >
              Registrar Entrada
            </BaseButton>
          </form>
        </div>

        <!-- Saída de Funcionário -->
        <div
          class="bg-white rounded-xl shadow-md p-5 border border-neutral-100"
        >
          <h2
            class="text-lg font-semibold text-danger-600 mb-3 flex items-center"
          >
            <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-2 text-danger-500" />
            Saída de Funcionário
          </h2>
          <form @submit.prevent="registrarSaida" class="space-y-3">
            <div>
              <label
                class="block text-sm font-semibold text-secondary-700 mb-1.5"
              >
                Selecionar Funcionário
              </label>
              <Listbox v-model="saidaForm.funcionarioId">
                <div class="relative">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-danger-400 focus:border-danger-400 transition-colors text-sm"
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
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ChevronUpDownIcon class="h-4 w-4 text-neutral-400" />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none border border-neutral-100"
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
                            'relative cursor-default select-none py-2 pl-9 pr-4 transition-colors',
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
                            class="absolute inset-y-0 left-0 flex items-center pl-2 text-danger-600"
                          >
                            <CheckIcon class="h-4 w-4" />
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
              size="sm"
              :icon="XMarkIcon"
              :disabled="!saidaForm.funcionarioId"
              full-width
            >
              Registrar Saída
            </BaseButton>
          </form>
        </div>
      </div>

      <!-- Dashboard Analytics -->
      <div class="mt-10 grid md:grid-cols-2 gap-6">
        <!-- Gráfico de Movimentação -->
        <ChartCard
          title="Movimentação de Hoje"
          type="line"
          :data="chartData"
          :summary-stats="chartSummary"
          @refresh="handleChartRefresh"
          @periodChange="handlePeriodChange"
        />

        <!-- Cards de Estatísticas -->
        <div
          v-if="chartSummary && chartSummary.length > 0"
          class="grid grid-cols-2 gap-4"
        >
          <StatCard
            v-for="stat in chartSummary"
            :key="stat.label"
            :title="stat.label"
            :value="stat.value"
            :icon="
              stat.label === 'Entradas'
                ? 'arrow-up'
                : stat.label === 'Saídas'
                ? 'arrow-down'
                : 'chart'
            "
            :color="
              stat.label === 'Entradas'
                ? 'success'
                : stat.label === 'Saídas'
                ? 'warning'
                : 'primary'
            "
          />
        </div>
      </div>

      <!-- Lista de Funcionários Presentes -->
      <div
        class="mt-10 bg-white rounded-2xl shadow-medium p-8 border border-neutral-100"
      >
        <div class="flex justify-between items-center mb-6">
          <h3
            class="text-2xl font-semibold text-secondary-800 flex items-center"
          >
            <UsersIcon class="h-7 w-7 mr-3 text-primary-500" />
            Funcionários Presentes
            <span
              class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-800"
            >
              {{ funcionariosPresentes.length }}
            </span>
          </h3>
          <BaseButton
            @click="carregarColaboradoresPresentes"
            variant="outline"
            size="sm"
            :icon="ArrowPathIcon"
          >
            Atualizar
          </BaseButton>
        </div>

        <!-- Abas -->
        <div class="flex border-b border-neutral-200 mb-6">
          <button
            @click="abaFuncionariosPresentes = 'cards'"
            :class="[
              'px-4 py-2 font-medium text-sm transition-colors',
              abaFuncionariosPresentes === 'cards'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-neutral-600 hover:text-neutral-800',
            ]"
          >
            Cards
          </button>
          <button
            @click="abaFuncionariosPresentes = 'lista'"
            :class="[
              'px-4 py-2 font-medium text-sm transition-colors',
              abaFuncionariosPresentes === 'lista'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-neutral-600 hover:text-neutral-800',
            ]"
          >
            Lista de Presença
          </button>
        </div>

        <!-- Conteúdo vazio -->
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

        <!-- Aba: Cards -->
        <div
          v-else-if="abaFuncionariosPresentes === 'cards'"
          class="grid gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          <div
            v-for="funcionario in funcionariosPresentes"
            :key="funcionario.id"
            class="border border-neutral-200 rounded-lg p-2 hover:shadow-md transition-all duration-200 hover:border-primary-300 bg-white"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h4
                  class="font-semibold text-secondary-800 flex items-center text-xs truncate"
                >
                  <UserIcon
                    class="h-3 w-3 mr-1 text-primary-500 flex-shrink-0"
                  />
                  {{ funcionario.nome }}
                </h4>

                <!-- Badge de origem -->
                <div class="mt-1">
                  <span
                    v-if="funcionario.origem === 'transportadoras'"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-100 text-amber-800"
                  >
                    🚚 Transportadora
                  </span>
                  <span
                    v-else-if="funcionario.origem === 'sfl'"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-100 text-blue-800"
                  >
                    🏢 SFL
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-green-100 text-green-800"
                  >
                    🔥 Incinerador
                  </span>
                </div>

                <p
                  class="text-secondary-600 flex items-center mt-0.5 text-[11px] truncate"
                >
                  <BriefcaseIcon
                    class="h-2.5 w-2.5 mr-1 text-neutral-400 flex-shrink-0"
                  />
                  {{ funcionario.cargo }}
                </p>
                <p
                  v-if="funcionario.matricula"
                  class="text-neutral-500 mt-0.5 flex items-center text-[11px]"
                >
                  <DocumentTextIcon
                    class="h-2.5 w-2.5 mr-1 text-neutral-400 flex-shrink-0"
                  />
                  Mat: {{ funcionario.matricula }}
                </p>
                <p
                  v-if="
                    funcionario.origem === 'transportadoras' &&
                    funcionario.filial
                  "
                  class="text-neutral-500 mt-0.5 flex items-center text-[11px]"
                >
                  🏭 {{ funcionario.filial }}
                </p>
                <p
                  class="text-neutral-500 mt-0.5 flex items-center text-[11px]"
                >
                  <ClockIcon
                    class="h-2.5 w-2.5 mr-1 text-neutral-400 flex-shrink-0"
                  />
                  {{ formatarHora(funcionario.horaEntrada) }}
                </p>
                <p
                  v-if="funcionario.dataEntrada"
                  class="text-neutral-500 mt-0.5 flex items-center text-[11px]"
                >
                  📅 {{ formatarDataCompleta(funcionario.dataEntrada) }}
                </p>
              </div>
              <div class="ml-1 flex flex-col items-center flex-shrink-0">
                <div
                  class="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse"
                ></div>
                <span class="text-[9px] text-success-600 font-medium mt-0.5"
                  >Online</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Aba: Lista com Checkbox -->
        <div v-else-if="abaFuncionariosPresentes === 'lista'" class="space-y-2">
          <div
            v-for="funcionario in funcionariosPresentes"
            :key="funcionario.id"
            class="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-secondary-800">
                  {{ funcionario.nome }}
                </span>
                <span
                  v-if="funcionario.origem === 'transportadoras'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800"
                >
                  🚚 Transportadora
                </span>
                <span
                  v-else-if="funcionario.origem === 'sfl'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800"
                >
                  🏢 SFL
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800"
                >
                  🔥 Incinerador
                </span>
              </div>
              <div
                class="flex items-center gap-3 mt-1 text-xs text-neutral-600"
              >
                <span>{{ funcionario.cargo }}</span>
                <span
                  v-if="
                    funcionario.origem === 'transportadoras' &&
                    funcionario.filial
                  "
                >
                  🏭 {{ funcionario.filial }}
                </span>
                <span>⏰ {{ formatarHora(funcionario.horaEntrada) }}</span>
              </div>
            </div>
            <input
              type="checkbox"
              class="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <!-- Dashboard de Histórico e Estatísticas -->
      <div
        class="mt-8 bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden"
      >
        <!-- Header com abas -->
        <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold text-white flex items-center">
              <DocumentTextIcon class="h-5 w-5 mr-2" />
              Centro de Controle
            </h3>
            <div class="flex items-center space-x-3">
              <!-- Seletor de Data -->
              <div
                class="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1.5"
              >
                <ClockIcon class="h-4 w-4 text-white" />
                <input
                  type="date"
                  v-model="dataSelecionada"
                  class="bg-transparent text-white text-sm font-medium border-none focus:outline-none focus:ring-0 cursor-pointer"
                  :max="new Date().toISOString().split('T')[0]"
                />
                <span
                  v-if="
                    dataSelecionada === new Date().toISOString().split('T')[0]
                  "
                  class="bg-success-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold"
                >
                  HOJE
                </span>
              </div>

              <div class="flex space-x-1.5">
                <button
                  v-for="(aba, index) in abasHistorico"
                  :key="index"
                  @click="abaAtiva = index"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    abaAtiva === index
                      ? 'bg-white text-primary-600 shadow-md'
                      : 'text-primary-100 hover:text-white hover:bg-primary-400',
                  ]"
                >
                  {{ aba.nome }}
                </button>
              </div>
            </div>
          </div>

          <!-- Estatísticas rápidas -->
          <div class="grid grid-cols-4 gap-3">
            <div class="text-center">
              <div class="text-2xl font-bold text-white">{{ totalHoje }}</div>
              <div class="text-primary-100 text-xs">Movimentações</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">
                {{ funcionariosPresentes.length }}
              </div>
              <div class="text-primary-100 text-xs">Presentes</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">{{ picoHorario }}</div>
              <div class="text-primary-100 text-xs">Pico do Dia</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">
                {{ tempoMedioPresenca }}
              </div>
              <div class="text-primary-100 text-xs">Tempo Médio</div>
            </div>
          </div>
        </div>

        <!-- Conteúdo do painel: gráfico + filtros -->
        <div class="p-5">
          <div class="grid grid-cols-1 gap-6">
            <!-- Gráfico principal -->
            <div>
              <ChartCard
                :title="'Entradas x Saídas'"
                type="line"
                :data="chartData"
                @refresh="handleChartRefresh"
                @periodChange="handlePeriodChange"
              />
            </div>
          </div>
        </div>

        <!-- Conteúdo das abas -->
        <div class="p-5">
          <!-- Aba Timeline -->
          <div v-if="abaAtiva === 0">
            <!-- Grid com Timeline + Resumo -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <!-- Timeline (2 colunas) -->
              <div class="lg:col-span-2">
                <div
                  class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
                >
                  <div>
                    <h4 class="text-xl font-semibold text-secondary-800">
                      Timeline do Dia
                    </h4>
                    <p class="text-sm text-neutral-500 mt-1">
                      {{ historicoFiltrado.length }}
                      {{
                        historicoFiltrado.length === 1
                          ? "movimentação"
                          : "movimentações"
                      }}
                      encontradas
                    </p>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full sm:w-auto">
                    <div class="relative flex-1 sm:flex-initial">
                      <select
                        v-model="filtroTipo"
                        class="w-full sm:w-auto pl-3 pr-8 py-2.5 border border-neutral-300 rounded-lg text-sm bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer appearance-none"
                      >
                        <option value="">📋 Todos os tipos</option>
                        <option value="entrada">✓ Entradas apenas</option>
                        <option value="saida">✗ Saídas apenas</option>
                      </select>
                      <ChevronUpDownIcon
                        class="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none"
                      />
                    </div>
                    <div
                      class="relative flex-1 sm:flex-initial sm:min-w-[280px]"
                    >
                      <UserIcon
                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none"
                      />
                      <input
                        v-model="filtroNome"
                        type="text"
                        placeholder="Buscar por nome ou cargo..."
                        class="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-lg text-sm bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                      <button
                        v-if="filtroNome"
                        @click="filtroNome = ''"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        <XMarkIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  v-if="historicoFiltrado.length === 0"
                  class="text-center py-16 bg-neutral-50 rounded-xl"
                >
                  <ClipboardDocumentListIcon
                    class="h-20 w-20 text-neutral-300 mb-4 mx-auto"
                  />
                  <p class="text-lg font-semibold text-neutral-600">
                    Nenhum registro encontrado
                  </p>
                  <p class="text-sm text-neutral-500 mt-2">
                    Os registros aparecerão aqui conforme as movimentações
                  </p>
                </div>

                <!-- Timeline visual moderna -->
                <div v-else class="relative space-y-3">
                  <!-- Linha vertical da timeline -->
                  <div
                    class="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary-300 via-primary-400 to-primary-300"
                  ></div>

                  <div
                    v-for="(registro, index) in historicoFiltrado"
                    :key="registro.id"
                    class="relative flex items-start group"
                  >
                    <!-- Ponto na timeline -->
                    <div class="relative z-10 flex-shrink-0">
                      <div
                        :class="[
                          'flex items-center justify-center w-10 h-10 rounded-full border-3 border-white shadow-lg transition-all duration-300 group-hover:scale-110',
                          registro.tipo === 'entrada'
                            ? 'bg-gradient-to-br from-success-500 to-success-600'
                            : 'bg-gradient-to-br from-danger-500 to-danger-600',
                        ]"
                      >
                        <ArrowRightOnRectangleIcon
                          v-if="registro.tipo === 'entrada'"
                          class="h-5 w-5 text-white"
                        />
                        <ArrowLeftOnRectangleIcon
                          v-else
                          class="h-5 w-5 text-white"
                        />
                      </div>
                    </div>

                    <!-- Card compacto do registro -->
                    <div
                      :class="[
                        'ml-5 flex-1 p-3 rounded-lg border transition-all duration-300 group-hover:shadow-md',
                        registro.tipo === 'entrada'
                          ? 'border-l-4 border-l-success-500 bg-white hover:bg-success-50/30'
                          : 'border-l-4 border-l-danger-500 bg-white hover:bg-danger-50/30',
                      ]"
                    >
                      <div class="flex justify-between items-center">
                        <!-- Informações principais -->
                        <div class="flex items-center space-x-4 flex-1">
                          <!-- Horário destacado -->
                          <div class="text-center">
                            <div class="text-xl font-bold text-secondary-800">
                              {{ formatarHora(registro.hora) }}
                            </div>
                            <div
                              class="text-[10px] text-neutral-500 uppercase font-semibold"
                            >
                              {{ calcularTempoRelativo(registro.hora) }}
                            </div>
                          </div>

                          <!-- Divisor -->
                          <div class="h-12 w-px bg-neutral-200"></div>

                          <!-- Dados do funcionário -->
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-2">
                              <h5
                                class="font-bold text-secondary-900 text-sm truncate"
                              >
                                {{ registro.nome }}
                              </h5>
                              <span
                                :class="[
                                  'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                                  registro.tipo === 'entrada'
                                    ? 'bg-success-100 text-success-700'
                                    : 'bg-danger-100 text-danger-700',
                                ]"
                              >
                                {{
                                  registro.tipo === "entrada"
                                    ? "✓ Entrada"
                                    : "✗ Saída"
                                }}
                              </span>
                            </div>
                            <div
                              class="flex items-center mt-1 space-x-3 text-xs text-secondary-600"
                            >
                              <span class="flex items-center">
                                <BriefcaseIcon
                                  class="h-3 w-3 mr-1 text-neutral-400"
                                />
                                {{ registro.funcao || "Sem cargo" }}
                              </span>
                              <span
                                v-if="registro.matricula"
                                class="flex items-center"
                              >
                                <DocumentTextIcon
                                  class="h-3 w-3 mr-1 text-neutral-400"
                                />
                                Mat: {{ registro.matricula }}
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- Badge de status animado -->
                        <div
                          :class="[
                            'w-2 h-2 rounded-full flex-shrink-0',
                            registro.tipo === 'entrada'
                              ? 'bg-success-500 animate-pulse'
                              : 'bg-danger-500',
                          ]"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Resumo (1 coluna) -->
              <div class="lg:col-span-1">
                <div
                  class="bg-gradient-to-br from-white to-neutral-50 rounded-lg border border-neutral-200 shadow-sm overflow-hidden sticky top-4"
                >
                  <!-- Header do card -->
                  <div
                    class="bg-gradient-to-r from-primary-600 to-primary-700 px-3 py-2"
                  >
                    <h4
                      class="text-white font-semibold text-sm flex items-center"
                    >
                      <DocumentTextIcon class="h-4 w-4 mr-1.5" />
                      Resumo
                    </h4>
                    <p class="text-primary-100 text-[10px] mt-0.5">
                      {{ formatarDataCompleta(new Date()) }}
                    </p>
                  </div>

                  <!-- Métricas principais -->
                  <div class="p-3 space-y-2">
                    <!-- Entradas -->
                    <div
                      class="flex items-center justify-between p-2 bg-success-50 rounded-md border border-success-200 hover:bg-success-100 transition-colors"
                    >
                      <div class="flex items-center space-x-2">
                        <div class="bg-success-500 p-1.5 rounded-md">
                          <ArrowRightOnRectangleIcon
                            class="h-3.5 w-3.5 text-white"
                          />
                        </div>
                        <div>
                          <p
                            class="text-[10px] font-medium text-success-700 uppercase"
                          >
                            Entradas
                          </p>
                          <p class="text-lg font-bold text-success-900">
                            {{ entradasHoje }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Saídas -->
                    <div
                      class="flex items-center justify-between p-2 bg-danger-50 rounded-md border border-danger-200 hover:bg-danger-100 transition-colors"
                    >
                      <div class="flex items-center space-x-2">
                        <div class="bg-danger-500 p-1.5 rounded-md">
                          <ArrowLeftOnRectangleIcon
                            class="h-3.5 w-3.5 text-white"
                          />
                        </div>
                        <div>
                          <p
                            class="text-[10px] font-medium text-danger-700 uppercase"
                          >
                            Saídas
                          </p>
                          <p class="text-lg font-bold text-danger-900">
                            {{ saidasHoje }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Diferença (Presentes) -->
                    <div
                      class="flex items-center justify-between p-2 bg-primary-50 rounded-md border border-primary-200 hover:bg-primary-100 transition-colors"
                    >
                      <div class="flex items-center space-x-2">
                        <div class="bg-primary-500 p-1.5 rounded-md">
                          <UsersIcon class="h-3.5 w-3.5 text-white" />
                        </div>
                        <div>
                          <p
                            class="text-[10px] font-medium text-primary-700 uppercase"
                          >
                            Presentes
                          </p>
                          <p class="text-lg font-bold text-primary-900">
                            {{ funcionariosPresentes.length }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Divisor -->
                    <div class="border-t border-neutral-200 my-2"></div>

                    <!-- Estatísticas secundárias -->
                    <div class="space-y-1.5">
                      <div
                        class="flex items-center justify-between py-1.5 px-2 hover:bg-neutral-50 rounded-md transition-colors"
                      >
                        <span
                          class="text-[10px] text-neutral-600 flex items-center"
                        >
                          <ClockIcon class="h-3 w-3 mr-1.5 text-neutral-400" />
                          Total
                        </span>
                        <span class="font-bold text-xs text-neutral-800">{{
                          totalHoje
                        }}</span>
                      </div>

                      <div
                        class="flex items-center justify-between py-1.5 px-2 hover:bg-neutral-50 rounded-md transition-colors"
                      >
                        <span
                          class="text-[10px] text-neutral-600 flex items-center"
                        >
                          <UserGroupIcon
                            class="h-3 w-3 mr-1.5 text-neutral-400"
                          />
                          Únicos
                        </span>
                        <span class="font-bold text-xs text-neutral-800">{{
                          funcionariosUnicos
                        }}</span>
                      </div>

                      <div
                        class="flex items-center justify-between py-1.5 px-2 hover:bg-neutral-50 rounded-md transition-colors"
                      >
                        <span
                          class="text-[10px] text-neutral-600 flex items-center"
                        >
                          <ClockIcon class="h-3 w-3 mr-1.5 text-neutral-400" />
                          Tempo Médio
                        </span>
                        <span class="font-bold text-xs text-neutral-800">{{
                          tempoMedioPresenca
                        }}</span>
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
                        {{ registro.funcao || "Sem cargo" }}
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
// Imports devem vir primeiro
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
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

// Importar componentes base
import BaseInput from "~/components/common/BaseInput.vue";
import BaseButton from "~/components/common/BaseButton.vue";

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
  loading: loadingColaboradores,
} = useColaboradores();

// Novo composable de histórico de movimentação
const {
  registrarMovimentacao,
  buscarMovimentacoesDia,
  buscarResumoColaboradoresDia,
  buscarTodosColaboradoresPresentes,
  loading: loadingHistorico,
  error: errorHistorico,
} = useHistoricoMovimentacao();

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

// Store de analytics
const analyticsStore = useAnalyticsStore();
const { summary, current } = storeToRefs(analyticsStore);

// Computed para garantir que summary está disponível
const chartSummary = computed(() => {
  return summary.value ?? [];
});

const chartData = computed(() => {
  return current.value ?? { labels: [], datasets: [] };
});

// Funções do Dashboard
const handleChartRefresh = (period) => {
  console.log("Atualizando gráfico:", period);
  analyticsStore?.updatePeriod(period);
};

const handlePeriodChange = (period) => {
  console.log("Mudando período:", period);
  analyticsStore?.updatePeriod(period);
};

// Estados reativos
const tiposAba = ["Incinerador", "SFL", "Transportadoras", "Visitantes"];

const entradaForm = ref({
  tipoAba: "",
  matricula: "",
  nome: "",
  funcao: "",
  filial: "",
  empresa: "",
  rg: "",
  autorizacao: "",
});

const saidaForm = ref({
  funcionarioId: "",
});

// Estado para data selecionada (para visualizar histórico)
const dataSelecionada = ref(new Date().toISOString().split("T")[0]);
const movimentacoesDia = ref([]);
const resumoDia = ref([]);
const colaboradoresPresentes = ref([]); // Lista global de colaboradores presentes (Principal + SFL)
const colaboradoresPresentesPrincipal = ref([]); // Lista de colaboradores presentes (Principal)
const colaboradoresPresentesSFL = ref([]); // Lista de colaboradores presentes (SFL)
const abaFuncionariosPresentes = ref("cards"); // Controle de aba: 'cards' ou 'lista'

const historico = computed(() => {
  // Usar movimentacoesDia que vem do composable
  return movimentacoesDia.value.sort(
    (a, b) => new Date(b.hora) - new Date(a.hora)
  ); // Mais recente primeiro
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

// Alias para compatibilidade com o template
const funcionariosPresentes = colaboradoresPresentes;

// Funcionário selecionado no formulário de saída
const funcionarioSelecionado = computed(() => {
  if (!saidaForm.value.funcionarioId) return null;
  return colaboradoresPresentes.value.find(
    (f) => f.id === parseInt(saidaForm.value.funcionarioId)
  );
});

// Computed properties para o dashboard
const historicoFiltrado = computed(() => {
  let resultado = historico.value;

  console.log("🔍 Filtrando histórico:", {
    total: resultado.length,
    filtroTipo: filtroTipo.value,
    filtroNome: filtroNome.value,
  });

  if (filtroTipo.value) {
    resultado = resultado.filter((r) => r.tipo === filtroTipo.value);
    console.log(`📊 Após filtro tipo: ${resultado.length} registros`);
  }

  if (filtroNome.value.trim()) {
    const termo = filtroNome.value.toLowerCase().trim();
    resultado = resultado.filter(
      (r) =>
        r.nome?.toLowerCase().includes(termo) ||
        r.funcao?.toLowerCase().includes(termo) ||
        r.cargo?.toLowerCase().includes(termo) ||
        r.matricula?.toString().includes(termo)
    );
    console.log(`📊 Após filtro nome: ${resultado.length} registros`);
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
  if (!entradaForm.value.nome.trim() || !entradaForm.value.tipoAba) return;

  try {
    const { tipoAba, nome, matricula, funcao, filial, empresa, rg, autorizacao } = entradaForm.value;

    console.log(`📝 Registrando entrada - Tipo: ${tipoAba}, Nome: ${nome}`);

    // Esta função simplesmente cria o cadastro se necessário
    // O histórico será registrado manualmente na página novaEntrada
    alert(`✅ Funcionário ${nome} cadastrado com sucesso!\n\nAgora vá para a tela "Controle de Entrada e Saída" para registrar os horários.`);

    // Limpar formulário
    entradaForm.value = {
      tipoAba: "",
      matricula: "",
      nome: "",
      funcao: "",
      filial: "",
      empresa: "",
      rg: "",
      autorizacao: "",
    };

    // Redirecionar para novaEntrada
    setTimeout(() => {
      navigateTo('/novaEntrada');
    }, 1000);

  } catch (err) {
    console.error("Erro ao registrar entrada:", err);
    alert("Erro ao registrar entrada. Tente novamente.");
  }
};

const registrarSaida = async () => {
  const funcionarioId = parseInt(saidaForm.value.funcionarioId);
  const funcionario = colaboradoresPresentes.value.find(
    (f) => f.id === funcionarioId
  );

  if (!funcionario) return;

  try {
    // Registrar saída usando o novo composable
    const resultado = await registrarMovimentacao(funcionarioId, "saida");

    if (resultado.success) {
      // Limpar seleção
      saidaForm.value.funcionarioId = "";

      console.log(`✅ Saída registrada para ${funcionario.nome}`);

      // Recarregar dados para atualizar o card de funcionários presentes
      await carregarMovimentacoesDia();
      await carregarColaboradoresPresentes(); // Atualizar lista global
      await buscarColaboradores();
    } else {
      console.error(`❌ Erro: ${resultado.error}`);
    }
  } catch (err) {
    console.error("Erro ao registrar saída:", err);
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
  if (!data) return "-";

  // Se for string no formato YYYY-MM-DD, adicionar hora para evitar problema de timezone
  if (typeof data === "string" && data.match(/^\d{4}-\d{2}-\d{2}$/)) {
    data = data + "T12:00:00"; // Adicionar meio-dia para evitar mudança de dia
  }

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
    // Se for string no formato ISO com timezone (ex: 2025-11-16T05:20:00+00:00)
    if (typeof data === "string") {
      // Extrair HH:MM diretamente da string sem conversão de timezone
      const timeMatch = data.match(/T(\d{2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
      }

      // Fallback: tentar como data normal
      const date = new Date(data);
      if (isNaN(date.getTime())) return "-";
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    // Se for objeto Date
    const date = new Date(data);
    if (isNaN(date.getTime())) return "-";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "-";
  }
};

// Função para carregar movimentações do dia selecionado
const carregarMovimentacoesDia = async () => {
  try {
    console.log("📅 Carregando movimentações do dia:", dataSelecionada.value);

    movimentacoesDia.value = await buscarMovimentacoesDia(
      dataSelecionada.value
    );

    console.log(
      "✅ Movimentações carregadas:",
      movimentacoesDia.value?.length || 0
    );

    resumoDia.value = await buscarResumoColaboradoresDia(dataSelecionada.value);

    console.log("✅ Resumo carregado:", resumoDia.value?.length || 0);
  } catch (err) {
    console.error("❌ Erro ao carregar movimentações:", err);
    // Inicializar arrays vazios em caso de erro
    movimentacoesDia.value = [];
    resumoDia.value = [];
  }
};

// Função para carregar TODOS os colaboradores presentes (independente do dia)
const carregarColaboradoresPresentes = async () => {
  try {
    console.log(
      "👥 Carregando colaboradores presentes (Principal + SFL + Transportadoras)..."
    );

    // Buscar de todas as origens
    const [presentesPrincipal, presentesSFL, presentesTransportadoras] =
      await Promise.all([
        buscarTodosColaboradoresPresentes("principal"),
        buscarTodosColaboradoresPresentes("sfl"),
        buscarTodosColaboradoresPresentes("transportadoras"),
      ]);

    // Mapear Principal
    colaboradoresPresentesPrincipal.value = presentesPrincipal.map((resumo) => {
      const horaEntrada = resumo.hora_entrada || null;
      return {
        id: resumo.colaborador_id,
        nome: resumo.nome,
        cargo: resumo.funcao || "Não informado",
        horaEntrada: horaEntrada,
        dataEntrada: resumo.data_entrada || null,
        matricula: resumo.matricula || null,
        filial: resumo.filial || null,
        origem: "principal",
      };
    });

    // Mapear SFL
    colaboradoresPresentesSFL.value = presentesSFL.map((resumo) => {
      const horaEntrada = resumo.hora_entrada || null;
      return {
        id: resumo.colaborador_id,
        nome: resumo.nome,
        cargo: resumo.funcao || "Não informado",
        horaEntrada: horaEntrada,
        dataEntrada: resumo.data_entrada || null,
        matricula: resumo.matricula || null,
        filial: resumo.filial || null,
        origem: "sfl",
      };
    });

    // Mapear Transportadoras
    const colaboradoresPresentesTransportadoras = presentesTransportadoras.map(
      (resumo) => {
        const horaEntrada = resumo.hora_entrada || null;
        return {
          id: resumo.colaborador_id,
          nome: resumo.nome,
          cargo: resumo.funcao || "Não informado",
          horaEntrada: horaEntrada,
          dataEntrada: resumo.data_entrada || null,
          matricula: null, // Transportadoras não têm matrícula
          filial: resumo.filial || null, // Empresa
          origem: "transportadoras",
        };
      }
    );

    // Combinar todas as listas
    colaboradoresPresentes.value = [
      ...colaboradoresPresentesPrincipal.value,
      ...colaboradoresPresentesSFL.value,
      ...colaboradoresPresentesTransportadoras,
    ];

    console.log(
      `✅ Colaboradores presentes carregados: ${colaboradoresPresentes.value.length} (Principal: ${colaboradoresPresentesPrincipal.value.length}, SFL: ${colaboradoresPresentesSFL.value.length}, Transportadoras: ${colaboradoresPresentesTransportadoras.length})`
    );
  } catch (err) {
    console.error("❌ Erro ao carregar colaboradores presentes:", err);
    colaboradoresPresentes.value = [];
  }
};

// Atualizar quando mudar a data
watch(dataSelecionada, async () => {
  await carregarMovimentacoesDia();
});

// Carregar dados na inicialização
onMounted(async () => {
  try {
    console.log("🚀 Iniciando carregamento de dados...");
    await buscarColaboradores();
    console.log("✅ Colaboradores carregados");

    // Aguardar um pouco para garantir que tudo está pronto
    await nextTick();
    await carregarMovimentacoesDia();
    await carregarColaboradoresPresentes(); // Carregar lista global de presentes
    console.log("✅ Dados iniciais carregados com sucesso");

    // Auto-refresh a cada 10 segundos para atualizar funcionários presentes
    const intervalId = setInterval(async () => {
      console.log("🔄 Auto-refresh: atualizando dados...");
      await carregarMovimentacoesDia();
      await carregarColaboradoresPresentes(); // Atualizar lista global de presentes
    }, 10000); // 10 segundos

    // Limpar interval quando o componente for desmontado
    onUnmounted(() => {
      clearInterval(intervalId);
    });
  } catch (err) {
    console.error("❌ Erro ao carregar dados iniciais:", err);
    // Não mostrar erro ao usuário, apenas log
  }
});
</script>
