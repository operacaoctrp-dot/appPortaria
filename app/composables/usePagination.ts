import { ref, computed } from "vue";

export interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export const usePagination = <T>(
  items: Ref<T[]>,
  options: PaginationOptions = {}
) => {
  const {
    initialPage = 1,
    initialPageSize = 20,
    pageSizeOptions = [10, 20, 50, 100],
  } = options;

  const currentPage = ref(initialPage);
  const pageSize = ref(initialPageSize);

  // Total de itens
  const totalItems = computed(() => items.value.length);

  // Total de páginas
  const totalPages = computed(
    () => Math.ceil(totalItems.value / pageSize.value) || 1
  );

  // Itens da página atual
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return items.value.slice(start, end);
  });

  // Navegação
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const firstPage = () => {
    currentPage.value = 1;
  };

  const lastPage = () => {
    currentPage.value = totalPages.value;
  };

  // Alterar tamanho da página
  const setPageSize = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1; // Resetar para primeira página
  };

  // Informações da página
  const pageInfo = computed(() => ({
    start: (currentPage.value - 1) * pageSize.value + 1,
    end: Math.min(currentPage.value * pageSize.value, totalItems.value),
    total: totalItems.value,
  }));

  // Estado de navegação
  const canGoNext = computed(() => currentPage.value < totalPages.value);
  const canGoPrevious = computed(() => currentPage.value > 1);

  // Páginas para exibir na navegação (máximo 5)
  const visiblePages = computed(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage.value - halfVisible);
    let end = Math.min(totalPages.value, start + maxVisible - 1);

    // Ajustar se não tiver páginas suficientes no final
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  // Resetar paginação quando lista mudar
  watch(
    () => items.value.length,
    () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1;
      }
    }
  );

  return {
    // Estado
    currentPage,
    pageSize,
    pageSizeOptions,

    // Computed
    totalItems,
    totalPages,
    paginatedItems,
    pageInfo,
    canGoNext,
    canGoPrevious,
    visiblePages,

    // Métodos
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
  };
};
