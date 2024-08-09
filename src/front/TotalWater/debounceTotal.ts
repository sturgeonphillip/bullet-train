export interface DebounceFetchProps {
  timeout: NodeJS.Timeout | null;
  abort: AbortController | null;
  value: number | number[];
  dateKey: string;
}

export function debounceTotal({ timeout, abort, value }: DebounceFetchProps) {
  if (timeout) {
    clearTimeout(timeout);
  }

  if (abort) {
    abort.abort();
  }

  abort = new AbortController();

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
    signal: abort.signal,
  };

  timeout = setTimeout(() => {
    console.log(options.body);
  }, 500);

  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };
}
