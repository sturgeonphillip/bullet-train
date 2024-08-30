// version of utils/debouncer that handles async functions
export function debouncer<T extends unknown[]>(
  func: (...args: T) => Promise<void>,
  wait: number
) {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: T) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args).catch((err) =>
        console.error('Debounced function error:', err)
      );
    }, wait);
  };
}
