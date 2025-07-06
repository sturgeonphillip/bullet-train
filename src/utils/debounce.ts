// called once when the component is rendered
// stable - no change unless the component is re-rendered

export function debounce<T>(
  fn: (arg: T) => void,
  delay: number
): (arg: T) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (arg: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(arg);
      timeoutId = null;
    }, delay);
  };
}
