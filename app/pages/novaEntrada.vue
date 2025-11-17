<template>
  <div>
    <!-- Page Header -->
    <div
      class="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4"
    >
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-xl font-semibold">Controle de entrada e saída</h1>
          </div>
          <div class="text-right">
            <div class="text-lg font-medium">{{ dataAtualFormatada }}</div>
            <div class="text-primary-100 text-sm">{{ diaSemanAtual }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Abas para alternar entre Principal e SFL -->
    <div class="container mx-auto px-4 mt-6">
      <div class="flex space-x-2 border-b border-neutral-200">
        <button
          @click="abaFilial = 'principal'"
          :class="[
            'px-6 py-3 font-semibold text-sm transition-all duration-200 border-b-2',
            abaFilial === 'principal'
              ? 'border-primary-600 text-primary-600 bg-primary-50'
              : 'border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50',
          ]"
        >
          📋 Principal
        </button>
        <button
          @click="abaFilial = 'sfl'"
          :class="[
            'px-6 py-3 font-semibold text-sm transition-all duration-200 border-b-2',
            abaFilial === 'sfl'
              ? 'border-primary-600 text-primary-600 bg-primary-50'
              : 'border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50',
          ]"
        >
          🏢 SFL
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div
        v-if="carregandoDados"
        class="flex justify-center items-center py-12"
      >
        <div class="flex items-center space-x-3">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
          ></div>
          <span class="text-secondary-600 font-medium"
            >Carregando colaboradores...</span
          >
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="errorMensagem"
        class="bg-danger-50 border border-danger-200 rounded-xl p-6 mb-6"
      >
        <div class="flex items-center space-x-3">
          <ExclamationTriangleIcon class="h-6 w-6 text-danger-600" />
          <div>
            <h3 class="text-danger-800 font-semibold">
              Erro ao carregar dados
            </h3>
            <p class="text-danger-600">{{ errorMensagem }}</p>
          </div>
        </div>
      </div>

      <!-- Tabela de Colaboradores -->
      <div
        v-else
        class="bg-white rounded-2xl shadow-medium border border-neutral-100 overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold text-secondary-800">
                Lista de Colaboradores
              </h2>
              <p class="text-sm text-secondary-600 mt-1">
                Total: {{ colaboradores?.length || 0 }} colaborador(es)
                <span v-if="termoPesquisa?.trim()">
                  • Filtrados: {{ colaboradoresFiltrados.length }}
                </span>
              </p>
            </div>
            <div class="flex space-x-3">
              <BaseButton
                @click="exportarExcel"
                variant="outline"
                size="sm"
                :loading="exportandoExcel"
              >
                📊 Excel
              </BaseButton>
              <BaseButton
                @click="exportarPDF"
                variant="outline"
                size="sm"
                :loading="exportandoPDF"
              >
                📄 PDF
              </BaseButton>
              <BaseButton
                @click="buscarColaboradores"
                variant="primary"
                size="sm"
                :icon="ArrowPathIcon"
                :loading="loading"
              >
                Atualizar
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Filtros de Pesquisa e Data -->
        <div class="px-6 py-4 border-b border-neutral-200 bg-white">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Campo de Pesquisa -->
            <div>
              <label
                for="pesquisa"
                class="block text-sm font-medium text-secondary-700 mb-2"
              >
                Pesquisar colaboradores
              </label>
              <div class="relative">
                <input
                  id="pesquisa"
                  v-model="termoPesquisa"
                  type="text"
                  placeholder="Digite o nome, matrícula, função ou filial..."
                  class="w-full px-4 py-2 pl-10 pr-4 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-4 w-4 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <button
                  v-if="termoPesquisa?.trim()"
                  @click="termoPesquisa = ''"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    class="h-4 w-4 text-neutral-400 hover:text-neutral-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Filtro de Data -->
            <div>
              <label
                for="filtroData"
                class="block text-sm font-medium text-secondary-700 mb-2"
              >
                Filtrar por data
              </label>
              <div class="relative">
                <input
                  id="filtroData"
                  v-model="dataFiltro"
                  type="date"
                  class="w-full px-4 py-2 pl-10 pr-4 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-4 w-4 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              </div>

              <!-- Botões de atalho de data -->
              <div class="flex gap-2 mt-2">
                <button
                  @click="definirDataHoje"
                  class="px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
                  title="Ir para hoje"
                >
                  📅 Hoje
                </button>
                <button
                  @click="definirDataOntem"
                  class="px-3 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors"
                  title="Ir para ontem"
                >
                  ⬅️ Ontem
                </button>
                <button
                  @click="definirSemanaAtual"
                  class="px-3 py-1 text-xs bg-success-100 text-success-700 rounded-md hover:bg-success-200 transition-colors"
                >
                  Esta Semana
                </button>
              </div>
            </div>
          </div>

          <!-- Informações de filtro ativo -->
          <div
            v-if="dataFiltro || termoPesquisa?.trim()"
            class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div class="flex items-center text-sm text-blue-800">
              <svg
                class="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Filtros ativos:</span>
              <span
                v-if="dataFiltro"
                class="ml-2 px-2 py-1 bg-blue-100 rounded text-xs"
              >
                📅 {{ formatarDataBrasileira(dataFiltro) }}
              </span>
              <span
                v-if="termoPesquisa?.trim()"
                class="ml-2 px-2 py-1 bg-blue-100 rounded text-xs"
              >
                🔍 "{{ termoPesquisa?.trim() }}"
              </span>
            </div>
          </div>
        </div>

        <!-- Tabela -->
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
                  <!-- Entradas e Saídas 1 -->
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
                  <!-- Entradas e Saídas 2 -->
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
                  <!-- Entradas e Saídas 3 -->
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
                  <!-- Entradas e Saídas 4 -->
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
                  <!-- Entradas e Saídas 5 -->
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
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-neutral-200">
                <!-- Nenhum colaborador cadastrado -->
                <tr v-if="!colaboradores || colaboradores.length === 0">
                  <td colspan="14" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <UsersIcon class="h-12 w-12 text-neutral-300 mb-4" />
                      <p class="text-neutral-500 font-medium">
                        Nenhum colaborador encontrado
                      </p>
                      <p class="text-sm text-neutral-400 mt-1">
                        Os colaboradores cadastrados aparecerão aqui
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Nenhum resultado na pesquisa -->
                <tr v-else-if="colaboradoresFiltrados.length === 0">
                  <td colspan="14" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <svg
                        class="h-12 w-12 text-neutral-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                      <p class="text-neutral-500 font-medium">
                        Nenhum resultado encontrado
                      </p>
                      <p class="text-sm text-neutral-400 mt-1">
                        Tente pesquisar por outro termo
                      </p>
                    </div>
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="colaborador in colaboradoresFiltrados"
                  :key="colaborador.id"
                  class="hover:bg-neutral-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center"
                      >
                        <span class="text-xs font-medium text-primary-700">
                          {{ colaborador.matricula || "—" }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-secondary-900">
                      {{ colaborador.nome || "Não informado" }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
                    >
                      {{ colaborador.funcao || "Não informado" }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500"
                  >
                    {{ colaborador.filial || "Não informado" }}
                  </td>

                  <!-- Entradas e Saídas individuais com edição inline -->
                  <!-- Entrada 1 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <!-- Edição inline individual -->
                    <div v-if="isCelulaEditando(colaborador.id, 'ent1')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-ent1`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'ent1')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'ent1')
                        "
                      />
                    </div>
                    <!-- Modo de visualização -->
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'ent1',
                          colaborador.ent1
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.ent1"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-success-100 text-success-700 text-xs"
                      >
                        {{ formatarHora(colaborador.ent1) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <!-- Modo de edição em lote (manter compatibilidade) -->
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.ent1"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Saída 1 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <div v-if="isCelulaEditando(colaborador.id, 'sai1')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-sai1`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'sai1')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'sai1')
                        "
                      />
                    </div>
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'sai1',
                          colaborador.sai1
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.sai1"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-danger-100 text-danger-700 text-xs"
                      >
                        {{ formatarHora(colaborador.sai1) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.sai1"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Entrada 2 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <div v-if="isCelulaEditando(colaborador.id, 'ent2')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-ent2`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'ent2')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'ent2')
                        "
                      />
                    </div>
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'ent2',
                          colaborador.ent2
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.ent2"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-success-100 text-success-700 text-xs"
                      >
                        {{ formatarHora(colaborador.ent2) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.ent2"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Saída 2 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <div v-if="isCelulaEditando(colaborador.id, 'sai2')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-sai2`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'sai2')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'sai2')
                        "
                      />
                    </div>
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'sai2',
                          colaborador.sai2
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.sai2"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-danger-100 text-danger-700 text-xs"
                      >
                        {{ formatarHora(colaborador.sai2) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.sai2"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Entrada 3 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <div v-if="isCelulaEditando(colaborador.id, 'ent3')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-ent3`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'ent3')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'ent3')
                        "
                      />
                    </div>
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'ent3',
                          colaborador.ent3
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.ent3"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-success-100 text-success-700 text-xs"
                      >
                        {{ formatarHora(colaborador.ent3) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.ent3"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Saída 3 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <div v-if="isCelulaEditando(colaborador.id, 'sai3')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-sai3`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'sai3')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'sai3')
                        "
                      />
                    </div>
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'sai3',
                          colaborador.sai3
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.sai3"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-danger-100 text-danger-700 text-xs"
                      >
                        {{ formatarHora(colaborador.sai3) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.sai3"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Entrada 4 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <div v-if="isCelulaEditando(colaborador.id, 'ent4')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-ent4`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'ent4')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'ent4')
                        "
                      />
                    </div>
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'ent4',
                          colaborador.ent4
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.ent4"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-success-100 text-success-700 text-xs"
                      >
                        {{ formatarHora(colaborador.ent4) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.ent4"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Saída 4 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <div v-if="isCelulaEditando(colaborador.id, 'sai4')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-sai4`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'sai4')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'sai4')
                        "
                      />
                    </div>
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'sai4',
                          colaborador.sai4
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.sai4"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-danger-100 text-danger-700 text-xs"
                      >
                        {{ formatarHora(colaborador.sai4) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.sai4"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Entrada 5 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <div v-if="isCelulaEditando(colaborador.id, 'ent5')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-ent5`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'ent5')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'ent5')
                        "
                      />
                    </div>
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'ent5',
                          colaborador.ent5
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.ent5"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-success-100 text-success-700 text-xs"
                      >
                        {{ formatarHora(colaborador.ent5) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.ent5"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Saída 5 -->
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <div v-if="isCelulaEditando(colaborador.id, 'sai5')">
                      <input
                        v-model="valorTemporario"
                        :data-celula="`${colaborador.id}-sai5`"
                        type="time"
                        class="text-xs border border-primary-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        @blur="salvarEdicaoCelula(colaborador.id, 'sai5')"
                        @keydown="
                          handleKeyPress($event, colaborador.id, 'sai5')
                        "
                      />
                    </div>
                    <div
                      v-else-if="editandoColaborador !== colaborador.id"
                      @dblclick="
                        iniciarEdicaoCelula(
                          colaborador.id,
                          'sai5',
                          colaborador.sai5
                        )
                      "
                      class="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                      title="Duplo clique para editar"
                    >
                      <span
                        v-if="colaborador.sai5"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-danger-100 text-danger-700 text-xs"
                      >
                        {{ formatarHora(colaborador.sai5) }}
                      </span>
                      <span v-else class="text-xs text-neutral-300">--:--</span>
                    </div>
                    <div v-else>
                      <input
                        v-model="colaboradorEditando.sai5"
                        type="time"
                        class="text-xs border border-neutral-300 rounded px-2 py-1 w-20"
                      />
                    </div>
                  </td>

                  <!-- Coluna de ações -->
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <div
                      v-if="editandoColaborador !== colaborador.id"
                      class="space-x-2"
                    >
                      <BaseButton
                        @click="iniciarEdicao(colaborador)"
                        variant="secondary"
                        size="sm"
                        class="text-xs"
                      >
                        Editar
                      </BaseButton>
                    </div>

                    <div v-else class="flex space-x-2">
                      <BaseButton
                        @click="salvarColaborador(colaborador.id)"
                        variant="primary"
                        size="sm"
                        :loading="salvandoColaborador"
                        class="text-xs"
                      >
                        Salvar
                      </BaseButton>
                      <BaseButton
                        @click="cancelarEdicao"
                        variant="danger"
                        size="sm"
                        class="text-xs"
                      >
                        Cancelar
                      </BaseButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer da tabela -->
        <div
          v-if="colaboradores && colaboradores.length > 0"
          class="px-6 py-3 bg-neutral-50 border-t border-neutral-200"
        >
          <p class="text-sm text-secondary-600">
            <span v-if="termoPesquisa?.trim()">
              Exibindo {{ colaboradoresFiltrados.length }} de
              {{ colaboradores.length }} colaborador(es)
            </span>
            <span v-else>
              Exibindo {{ colaboradores.length }} colaborador(es)
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de Notificação -->
    <div
      v-if="modalAberto"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="modalAberto = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div
          :class="[
            'px-6 py-4 flex items-center',
            modalTipo === 'success'
              ? 'bg-gradient-to-r from-success-500 to-success-600'
              : 'bg-gradient-to-r from-danger-500 to-danger-600',
          ]"
        >
          <div
            :class="[
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3',
              modalTipo === 'success' ? 'bg-success-100' : 'bg-danger-100',
            ]"
          >
            <svg
              v-if="modalTipo === 'success'"
              class="w-5 h-5 text-success-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-danger-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white">{{ modalTitulo }}</h3>
        </div>

        <!-- Conteúdo -->
        <div class="px-6 py-4">
          <p class="text-secondary-700">{{ modalMensagem }}</p>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-neutral-50 flex justify-end">
          <BaseButton @click="modalAberto = false" variant="primary" size="sm">
            OK
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, onMounted, watch } from "vue";
import { utils, writeFile } from "xlsx";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/vue/24/outline";

// Aplicar middleware de autenticação
definePageMeta({
  middleware: "auth",
});

// Composable para gerenciar colaboradores
const {
  colaboradores: colaboradoresStore,
  loading,
  error,
  buscarColaboradores,
  atualizarColaborador,
} = useColaboradores();

// Composable para gerenciar colaboradores SFL
const {
  colaboradoresSFL: colaboradoresSFLStore,
  loading: loadingSFL,
  error: errorSFL,
  buscarColaboradoresSFL,
  atualizarColaborador: atualizarColaboradorSFL,
} = useColaboradoresSFL();

// Estado para controlar qual aba está ativa
const abaFilial = ref("principal");

// Composable para gerenciar histórico
const {
  buscarHistoricoPorData,
  salvarHistorico,
  buscarHistoricosPorData,
  mesclarColaboradoresComHistorico,
} = useHistorico();

// Estado local para colaboradores (writable)
const colaboradores = ref([]);

// Computed para retornar os colaboradores do store ativo
const colaboradoresStoreAtivo = computed(() => {
  return abaFilial.value === "principal"
    ? colaboradoresStore.value
    : colaboradoresSFLStore.value;
});

// Função para buscar colaboradores da aba ativa
const buscarColaboradoresAtivos = async () => {
  if (abaFilial.value === "principal") {
    await buscarColaboradores();
  } else {
    await buscarColaboradoresSFL();
  }
};

// Função para atualizar colaborador na aba ativa
const atualizarColaboradorAtivo = async (id, dados) => {
  if (abaFilial.value === "principal") {
    return await atualizarColaborador(id, dados);
  } else {
    return await atualizarColaboradorSFL(id, dados);
  }
};

// Estado de edição
const editandoColaborador = ref(null);
const colaboradorEditando = ref({});
const salvandoColaborador = ref(false);

// Estado para edição inline de células individuais
const editandoCelula = ref(null); // Formato: "colaboradorId-campo" ex: "123-ent1"
const valorTemporario = ref("");
const salvandoCelula = ref(false);

// Estado para pesquisa
const termoPesquisa = ref("");

// Estado para filtro de data (inicializa com data de hoje)
const dataFiltro = ref(new Date().toISOString().split("T")[0]); // formato YYYY-MM-DD

// Estado para loading de dados
const carregandoDados = ref(false);
const errorMensagem = ref(null);

// Estado para exportação
const exportandoExcel = ref(false);
const exportandoPDF = ref(false);

// Estado para modal de notificação
const modalAberto = ref(false);
const modalTitulo = ref("");
const modalMensagem = ref("");
const modalTipo = ref("success"); // success, error

// Computed para data atual
const dataAtualFormatada = computed(() => {
  const hoje = new Date();
  return hoje.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

const diaSemanAtual = computed(() => {
  const hoje = new Date();
  return hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
  });
});

// Computed para filtrar colaboradores
const colaboradoresFiltrados = computed(() => {
  if (!colaboradores.value) return [];

  let resultados = colaboradores.value;

  // Filtro por texto
  if (termoPesquisa.value && termoPesquisa.value.trim()) {
    const termo = termoPesquisa.value.toLowerCase().trim();
    resultados = resultados.filter(
      (colaborador) =>
        colaborador.nome?.toLowerCase().includes(termo) ||
        colaborador.matricula?.toString().includes(termo) ||
        colaborador.funcao?.toLowerCase().includes(termo) ||
        colaborador.filial?.toLowerCase().includes(termo)
    );
  }

  // NÃO filtrar por data - sempre mostrar TODOS os colaboradores
  // A data é usada apenas para carregar/salvar o histórico correto

  return resultados;
});

// Função para iniciar edição
const iniciarEdicao = (colaborador) => {
  editandoColaborador.value = colaborador.id;

  // Converter timestamps para formato time (HH:MM)
  const colaboradorParaEdicao = { ...colaborador };
  for (let i = 1; i <= 5; i++) {
    const entKey = `ent${i}`;
    const saiKey = `sai${i}`;

    if (colaboradorParaEdicao[entKey]) {
      colaboradorParaEdicao[entKey] = timestampParaHora(
        colaboradorParaEdicao[entKey]
      );
    }
    if (colaboradorParaEdicao[saiKey]) {
      colaboradorParaEdicao[saiKey] = timestampParaHora(
        colaboradorParaEdicao[saiKey]
      );
    }
  }

  colaboradorEditando.value = colaboradorParaEdicao;
};

// Função para cancelar edição
const cancelarEdicao = () => {
  editandoColaborador.value = null;
  colaboradorEditando.value = {};
};

// Funções para edição inline de células individuais
const iniciarEdicaoCelula = (colaboradorId, campo, valorAtual) => {
  const chave = `${colaboradorId}-${campo}`;
  editandoCelula.value = chave;

  // Converter timestamp para format HH:MM se necessário
  if (valorAtual) {
    valorTemporario.value = timestampParaHora(valorAtual);
  } else {
    valorTemporario.value = "";
  }

  // Focar no input após a próxima atualização do DOM
  nextTick(() => {
    const input = document.querySelector(`input[data-celula="${chave}"]`);
    if (input) {
      input.focus();
      input.select();
    }
  });
};

const salvarEdicaoCelula = async (colaboradorId, campo) => {
  console.log("🔧 salvarEdicaoCelula CHAMADA:", {
    colaboradorId,
    campo,
    salvandoCelula: salvandoCelula.value,
  });

  if (salvandoCelula.value) {
    console.log("⏸️ Salvamento já em andamento, ignorando...");
    return;
  }

  try {
    salvandoCelula.value = true;

    const valorAtual = valorTemporario.value;
    console.log(
      `💾 Salvando ${campo} para colaborador ${colaboradorId}: ${valorAtual}`
    );

    // Buscar colaborador para pegar dados cadastrais
    const colaborador = colaboradores.value.find((c) => c.id === colaboradorId);
    console.log("👤 Colaborador encontrado:", colaborador ? "SIM" : "NÃO");
    if (!colaborador) {
      throw new Error("Colaborador não encontrado");
    }

    // Preparar dados para atualização
    const dadosAtualizados = {};

    if (valorAtual && valorAtual.trim()) {
      // Converter "HH:MM" para timestamp ISO
      const [horas, minutos] = valorAtual.split(":");

      console.log(
        `🕐 Convertendo ${campo}: ${valorAtual} (${horas}:${minutos})`
      );

      // Criar timestamp usando UTC para evitar problemas de fuso horário
      // Formato: YYYY-MM-DDTHH:MM:00.000Z
      const timestampISO = `${dataFiltro.value}T${String(horas).padStart(
        2,
        "0"
      )}:${String(minutos).padStart(2, "0")}:00.000Z`;

      console.log(`📅 Timestamp ISO criado: ${timestampISO}`);

      dadosAtualizados[campo] = timestampISO;
    } else {
      // Se vazio, setar como null
      dadosAtualizados[campo] = null;
    }

    // Buscar histórico existente da data atual para este colaborador
    console.log("🔍 Buscando histórico para:", {
      colaboradorId,
      data: dataFiltro.value,
      origem: abaFilial.value,
    });
    const { historico: historicoColaborador } = await buscarHistoricoPorData(
      colaboradorId,
      dataFiltro.value,
      abaFilial.value
    );
    console.log("📋 Histórico encontrado:", historicoColaborador);

    // Preparar dados completos do histórico
    // ⚠️ IMPORTANTE: Usar APENAS dados do histórico da data selecionada
    // NÃO usar dados da tabela colaboradores (que não tem relação com data)
    const dadosHistorico = {
      nome: colaborador.nome,
      funcao: colaborador.funcao,
      filial: colaborador.filial,
      matricula: colaborador.matricula,
      // Campos de entrada/saída APENAS do histórico existente para esta data
      ent1: historicoColaborador?.ent1 || null,
      sai1: historicoColaborador?.sai1 || null,
      ent2: historicoColaborador?.ent2 || null,
      sai2: historicoColaborador?.sai2 || null,
      ent3: historicoColaborador?.ent3 || null,
      sai3: historicoColaborador?.sai3 || null,
      ent4: historicoColaborador?.ent4 || null,
      sai4: historicoColaborador?.sai4 || null,
      ent5: historicoColaborador?.ent5 || null,
      sai5: historicoColaborador?.sai5 || null,
      // Atualizar campo específico
      [campo]: dadosAtualizados[campo],
    };

    // Salvar no histórico APENAS (não salvar na tabela principal)
    // A tabela colaboradores é apenas cadastral, não tem relação com datas
    console.log("💾 Salvando no histórico para data:", dataFiltro.value);
    console.log("📝 Dados:", dadosHistorico);
    console.log("🔧 Campo:", campo, "Valor:", dadosAtualizados[campo]);
    console.log("� Origem:", abaFilial.value);
    console.log("�🚀 Chamando salvarHistorico...");

    const resultado = await salvarHistorico(
      colaboradorId,
      dataFiltro.value,
      dadosHistorico,
      abaFilial.value
    );

    console.log("📦 Resultado do salvarHistorico:", resultado);

    if (resultado?.error) {
      console.error("❌ Falha ao salvar:", resultado?.error);
      const errorMsg =
        typeof resultado?.error === "string"
          ? resultado?.error
          : resultado?.error?.message || JSON.stringify(resultado?.error);
      throw new Error(errorMsg || "Erro ao salvar histórico");
    }

    console.log("✅ Histórico salvo com sucesso!");

    // Cancelar edição primeiro
    cancelarEdicaoCelula();

    // Recarregar dados para garantir sincronização
    await carregarDadosPorData(dataFiltro.value);

    // Salvo sem notificação para não poluir a interface
  } catch (err) {
    console.error("❌ Erro ao salvar célula:", err);

    // Verificar se é erro de tabela não existente
    if (err.message?.includes("colaboradores_historico")) {
      alert(
        "⚠️ ERRO: Tabela de histórico não encontrada!\n\n" +
          "Para que as edições de horário funcionem, você precisa:\n\n" +
          "1. Acessar o Supabase Dashboard\n" +
          "2. Ir em SQL Editor\n" +
          "3. Executar o script: database/create_historico_table.sql\n\n" +
          "Consulte o arquivo SETUP_TABELA_HISTORICO.md para instruções detalhadas."
      );
    } else if (err.message?.includes("origem")) {
      alert(
        "⚠️ ERRO: Coluna 'origem' não encontrada!\n\n" +
          "Execute o script SQL para adicionar a coluna:\n\n" +
          "1. Acessar o Supabase Dashboard\n" +
          "2. Ir em SQL Editor\n" +
          "3. Executar: database/adicionar_coluna_origem.sql\n\n" +
          "Consulte ATUALIZACAO_ORIGEM_HISTORICO.md para mais detalhes."
      );
    } else {
      const errorMsg = err.message || String(err);
      alert(`Erro ao salvar: ${errorMsg}. Tente novamente.`);
    }
  } finally {
    salvandoCelula.value = false;
  }
};

const cancelarEdicaoCelula = () => {
  editandoCelula.value = null;
  valorTemporario.value = "";
};

const handleKeyPress = (event, colaboradorId, campo) => {
  if (event.key === "Enter") {
    salvarEdicaoCelula(colaboradorId, campo);
  } else if (event.key === "Escape") {
    cancelarEdicaoCelula();
  }
};

// Função helper para determinar se uma célula está sendo editada
const isCelulaEditando = (colaboradorId, campo) => {
  return editandoCelula.value === `${colaboradorId}-${campo}`;
};

// Função helper para determinar a cor da célula
const getCorCelula = (campo) => {
  return campo.startsWith("ent") ? "success" : "danger";
};

// Função para salvar alterações
const salvarColaborador = async (id) => {
  try {
    salvandoColaborador.value = true;

    // Preparar dados para atualização - apenas campos de entrada/saída
    const dadosAtualizados = {
      ent1: colaboradorEditando.value.ent1 || null,
      sai1: colaboradorEditando.value.sai1 || null,
      ent2: colaboradorEditando.value.ent2 || null,
      sai2: colaboradorEditando.value.sai2 || null,
      ent3: colaboradorEditando.value.ent3 || null,
      sai3: colaboradorEditando.value.sai3 || null,
      ent4: colaboradorEditando.value.ent4 || null,
      sai4: colaboradorEditando.value.sai4 || null,
      ent5: colaboradorEditando.value.ent5 || null,
      sai5: colaboradorEditando.value.sai5 || null,
    };

    // Converter strings de time para timestamps
    for (const [key, value] of Object.entries(dadosAtualizados)) {
      if (value && typeof value === "string") {
        // Converter "HH:MM" para timestamp com fuso horário brasileiro correto
        const hoje = new Date();
        const [horas, minutos] = value.split(":");

        console.log(`🕐 Convertendo ${key}: ${value} (${horas}:${minutos})`);

        // CORRIGIR fuso horário: SUBTRAIR 3 horas para que quando
        // o sistema aplicar UTC-3, fique o horário correto
        const horasComCompensacao = parseInt(horas) - 3;

        const dataUTC = new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          hoje.getDate(),
          horasComCompensacao,
          parseInt(minutos),
          0
        );

        console.log(`📅 Hora original: ${horas}:${minutos}`);
        console.log(`📅 Hora compensada: ${horasComCompensacao}:${minutos}`);
        console.log(`📅 Data UTC: ${dataUTC.toString()}`);
        console.log(`📅 ISO String: ${dataUTC.toISOString()}`);

        dadosAtualizados[key] = dataUTC.toISOString();
      }
    }

    await atualizarColaborador(id, dadosAtualizados);

    // Sair do modo de edição
    cancelarEdicao();
  } catch (err) {
    console.error("Erro ao salvar colaborador:", err);
    alert("Erro ao salvar alterações. Tente novamente.");
  } finally {
    salvandoColaborador.value = false;
  }
};

// Função de formatação
const formatarHora = (data) => {
  if (!data) return "";

  try {
    const date = new Date(data);
    // Usar UTC para evitar conversão de timezone, já que o banco armazena correto
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "Hora inválida";
  }
};

// Função para converter timestamp para formato HH:MM (para inputs)
const timestampParaHora = (timestamp) => {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);
    // Usar UTC para evitar conversão de timezone, já que o banco armazena correto
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "";
  }
};

// Funções para filtro de data
const formatarDataBrasileira = (dataISO) => {
  if (!dataISO) return "";
  const data = new Date(dataISO + "T00:00:00");
  return data.toLocaleDateString("pt-BR");
};

const definirDataHoje = () => {
  const hoje = new Date();
  dataFiltro.value = hoje.toISOString().split("T")[0];
};

const definirDataOntem = () => {
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  dataFiltro.value = ontem.toISOString().split("T")[0];
};

const definirSemanaAtual = () => {
  // Para este caso, vamos definir como segunda-feira da semana atual
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda
  const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;

  const segundaFeira = new Date(hoje);
  segundaFeira.setDate(hoje.getDate() + diasParaSegunda);

  dataFiltro.value = segundaFeira.toISOString().split("T")[0];
};

// Função para mostrar notificações
const mostrarNotificacao = (titulo, mensagem, tipo = "success") => {
  modalTitulo.value = titulo;
  modalMensagem.value = mensagem;
  modalTipo.value = tipo;
  modalAberto.value = true;
};

// Funções de exportação
const exportarExcel = async () => {
  try {
    exportandoExcel.value = true;

    // Preparar dados para exportação
    const dadosParaExportar = colaboradoresFiltrados.value.map(
      (colaborador) => ({
        Matrícula: colaborador.matricula || "",
        Nome: colaborador.nome || "",
        Função: colaborador.funcao || "",
        Filial: colaborador.filial || "",
        "Entrada 1": formatarHora(colaborador.ent1),
        "Saída 1": formatarHora(colaborador.sai1),
        "Entrada 2": formatarHora(colaborador.ent2),
        "Saída 2": formatarHora(colaborador.sai2),
        "Entrada 3": formatarHora(colaborador.ent3),
        "Saída 3": formatarHora(colaborador.sai3),
        "Entrada 4": formatarHora(colaborador.ent4),
        "Saída 4": formatarHora(colaborador.sai4),
        "Entrada 5": formatarHora(colaborador.ent5),
        "Saída 5": formatarHora(colaborador.sai5),
      })
    );

    // Criar planilha
    const ws = utils.json_to_sheet(dadosParaExportar);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Colaboradores");

    // Baixar arquivo
    const hoje = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
    writeFile(wb, `colaboradores_${hoje}.xlsx`);

    mostrarNotificacao(
      "Exportação Concluída",
      `Arquivo Excel exportado com sucesso! (colaboradores_${hoje}.xlsx)`,
      "success"
    );
  } catch (err) {
    console.error("Erro ao exportar Excel:", err);
    mostrarNotificacao(
      "Erro na Exportação",
      "Erro ao exportar arquivo Excel. Tente novamente.",
      "error"
    );
  } finally {
    exportandoExcel.value = false;
  }
};

const exportarPDF = async () => {
  try {
    exportandoPDF.value = true;

    // Tentar abordagem alternativa sem autoTable
    const { default: jsPDF } = await import("jspdf");

    // Criar documento PDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Título
    doc.setFontSize(18);
    doc.text("Lista de Colaboradores", 20, 20);

    // Data
    const hoje = new Date().toLocaleDateString("pt-BR");
    doc.setFontSize(12);
    doc.text(`Gerado em: ${hoje}`, 20, 30);

    // Criar tabela manualmente
    let yPosition = 50;
    const lineHeight = 6;
    const colWidths = [20, 40, 30, 25, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
    let xPosition = 10;

    // Cabeçalhos
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");

    const headers = [
      "Matrícula",
      "Nome",
      "Função",
      "Filial",
      "Ent1",
      "Sai1",
      "Ent2",
      "Sai2",
      "Ent3",
      "Sai3",
      "Ent4",
      "Sai4",
      "Ent5",
      "Sai5",
    ];

    // Desenhar cabeçalhos
    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition);
      xPosition += colWidths[index];
    });

    yPosition += lineHeight;
    doc.setFont(undefined, "normal");
    doc.setFontSize(8);

    // Dados
    colaboradoresFiltrados.value.forEach((colaborador) => {
      if (yPosition > 200) {
        // Nova página se necessário
        doc.addPage();
        yPosition = 20;
      }

      xPosition = 10;
      const row = [
        colaborador.matricula || "",
        colaborador.nome || "",
        colaborador.funcao || "",
        colaborador.filial || "",
        formatarHora(colaborador.ent1),
        formatarHora(colaborador.sai1),
        formatarHora(colaborador.ent2),
        formatarHora(colaborador.sai2),
        formatarHora(colaborador.ent3),
        formatarHora(colaborador.sai3),
        formatarHora(colaborador.ent4),
        formatarHora(colaborador.sai4),
        formatarHora(colaborador.ent5),
        formatarHora(colaborador.sai5),
      ];

      row.forEach((cell, index) => {
        // Truncar texto se muito longo
        let text = String(cell || "");
        if (text.length > 12 && index > 3) text = text.substring(0, 10) + "..";
        if (text.length > 15 && index <= 3) text = text.substring(0, 13) + "..";

        doc.text(text, xPosition, yPosition);
        xPosition += colWidths[index];
      });

      yPosition += lineHeight;
    });

    // Baixar PDF
    const dataFormatada = hoje.replace(/\//g, "-");
    doc.save(`colaboradores_${dataFormatada}.pdf`);

    mostrarNotificacao(
      "Exportação Concluída",
      `Arquivo PDF exportado com sucesso! (colaboradores_${dataFormatada}.pdf)`,
      "success"
    );
  } catch (err) {
    console.error("Erro ao exportar PDF:", err);
    mostrarNotificacao(
      "Erro na Exportação",
      `Erro ao exportar arquivo PDF: ${err.message}. Tente novamente.`,
      "error"
    );
  } finally {
    exportandoPDF.value = false;
  }
};

/**
 * Carregar dados por data
 * Busca colaboradores e mescla com histórico da data selecionada
 */
const carregarDadosPorData = async (data) => {
  // Validar se a data não está vazia
  if (!data || data.trim() === "") {
    console.warn("⚠️ Data inválida ou vazia, usando data de hoje");
    data = new Date().toISOString().split("T")[0];
    dataFiltro.value = data;
  }

  carregandoDados.value = true;

  try {
    console.log(`📅 Carregando dados para data: ${data}`);
    console.log(`📋 Aba ativa: ${abaFilial.value}`);

    // 1. Buscar colaboradores da aba ativa (dados cadastrais)
    await buscarColaboradoresAtivos();

    // 2. Buscar históricos da data selecionada para a aba ativa
    const { historicos, error: errorHistorico } = await buscarHistoricosPorData(
      data,
      abaFilial.value
    );

    if (errorHistorico) {
      console.error("Erro ao buscar históricos:", errorHistorico);
      throw errorHistorico;
    }

    console.log(`✅ ${historicos?.length || 0} históricos encontrados`);

    // 3. Mesclar dados cadastrais com dados do histórico
    if (
      colaboradoresStoreAtivo.value &&
      colaboradoresStoreAtivo.value.length > 0
    ) {
      colaboradores.value = mesclarColaboradoresComHistorico(
        colaboradoresStoreAtivo.value,
        historicos
      );
    }

    console.log(`✅ Dados carregados para data: ${data}`);
    errorMensagem.value = null;
  } catch (err) {
    console.error("❌ Erro ao carregar dados:", err);

    // Se a tabela não existe, apenas mostrar log, não erro ao usuário
    if (err?.code === "42P01" || err?.message?.includes("does not exist")) {
      console.warn("⚠️ Tabela colaboradores_historico não existe");
      errorMensagem.value = null;
      return; // Não mostrar erro ao usuário
    }

    errorMensagem.value = "Erro ao carregar dados da data selecionada";
    mostrarNotificacao(
      "Erro ao Carregar",
      "Erro ao carregar dados da data selecionada. Tente novamente.",
      "error"
    );
  } finally {
    carregandoDados.value = false;
  }
};

// Carregar dados na inicialização
onMounted(async () => {
  try {
    // Carregar ambos os stores na inicialização
    await buscarColaboradores();
    await buscarColaboradoresSFL();
    // Depois carregar os dados da data selecionada
    await carregarDadosPorData(dataFiltro.value);
  } catch (err) {
    console.error("Erro ao carregar colaboradores:", err);
  }
});

// Observar mudanças na aba e recarregar dados
watch(abaFilial, async (novaAba) => {
  console.log(`🔄 Aba alterada para: ${novaAba}`);
  await carregarDadosPorData(dataFiltro.value);
});

// Observar mudanças na data e recarregar dados
watch(dataFiltro, (novaData) => {
  console.log(`🔄 Data alterada para: ${novaData}`);

  // Se a data foi limpa, definir para hoje
  if (!novaData || novaData.trim() === "") {
    console.log("⚠️ Data vazia, resetando para hoje");
    dataFiltro.value = new Date().toISOString().split("T")[0];
    return;
  }

  // Carregar dados da nova data
  carregarDadosPorData(novaData);
});

// Meta tags para SEO
useHead({
  title: "Colaboradores - Sistema de Portaria",
  meta: [
    {
      name: "description",
      content: "Lista de colaboradores cadastrados no sistema de portaria",
    },
  ],
});
</script>
