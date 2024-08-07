interface DynamicRequestBody<V> {
  [key: string]: V;
}

export interface DebounceFetchProps {
  timeout: NodeJS.Timeout | null;
  abort: AbortController | null;
  value: DynamicRequestBody<string | number | number[]>;
  dateKey: string;
}

export function debounceFetch({
  timeout = null,
  abort = null,
  value,
  dateKey,
}: DebounceFetchProps) {
  if (timeout) {
    clearTimeout(timeout);
  }

  if (abort) {
    abort.abort(); // cancel previous request
  }
  abort = new AbortController();

  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
    signal: abort.signal, // pass signal to fetch request
  };

  timeout = setTimeout(() => {
    fetch(`http://localhost:3001/water/${dateKey}`, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update water data.');
        }
        console.log(
          `Successfully updated water data: ${JSON.stringify(value)}`
        );
      })
      .catch((err) => {
        console.error(`Error updating water data: ${err}`);
      });
  }, 1000);

  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };
}
