import { ref, watch } from "vue";

/**
 * Composable para debounce de valores reativos
 * Útil para buscas, inputs, etc.
 *
 * @example
 * const searchQuery = ref('');
 * const debouncedSearch = useDebouncedRef(searchQuery, 300);
 *
 * watch(debouncedSearch, async (value) => {
 *   // Esta função só executa 300ms após o usuário parar de digitar
 *   await searchUsers(value);
 * });
 */
export function useDebouncedRef<T>(value: Ref<T>, delay = 300) {
  const debounced = ref(value.value) as Ref<T>;
  let timeout: NodeJS.Timeout;

  watch(value, (newValue) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debounced.value = newValue;
    }, delay);
  });

  return debounced;
}

/**
 * Função de debounce genérica
 * Útil para qualquer função que precise de debounce
 *
 * @example
 * const handleSearch = debounce(async (query) => {
 *   await searchUsers(query);
 * }, 300);
 *
 * // Chama várias vezes, mas só executa após 300ms do último call
 * handleSearch('john');
 * handleSearch('john doe');  // Cancela o anterior
 * handleSearch('john doe smith');  // Cancela o anterior, executa este
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Composable para throttle (limita taxa de execução)
 * Diferente do debounce, executa imediatamente e depois bloqueia
 * por um período
 *
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('Scroll event');
 * }, 100);
 *
 * window.addEventListener('scroll', handleScroll);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit = 300
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Composable que combina ref com debounce
 * Retorna valor atual e valor com debounce
 *
 * @example
 * const { value, debouncedValue, setValue } = useDebounce('', 300);
 *
 * watch(debouncedValue, (newValue) => {
 *   // Busca após 300ms sem mudanças
 *   searchUsers(newValue);
 * });
 */
export function useDebounce<T>(initialValue: T, delay = 300) {
  const value = ref(initialValue) as Ref<T>;
  const debouncedValue = ref(initialValue) as Ref<T>;
  let timeout: NodeJS.Timeout;

  const setValue = (newValue: T) => {
    value.value = newValue;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  };

  watch(value, (newValue) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return {
    value,
    debouncedValue,
    setValue,
  };
}
