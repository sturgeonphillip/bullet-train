// import { useEffect } from 'react';
export interface DebounceFetchProps {
  timeout: NodeJS.Timeout | null;
  abort: AbortController | null;
  value: number;
  dateKey: string;
  trigger?: boolean;
}

export function debounceTotalOz({
  // timeout = null,
  // abort = null,
  timeout,
  abort,
  value,
}: DebounceFetchProps) {
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
    console.log('options.body', options.body);
    // fetch(`http://localhost:3001/water/${dateKey}`, options)
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw new Error('Failed to update water data.');
    //     }
    //     console.log('Successfully updated water data.');
    //   })
    //   .catch((err) => {
    //     console.error(`Error updating water data: ${err}`);
    //   });
  }, 2000);

  // useEffect(() => {
  //   console.log('value from hook', value);
  // }, [value]);

  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };
}
