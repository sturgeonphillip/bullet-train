// declare debounceTimer at top of component
export function debounceFetch(dateKey: string, updatedTotal: number[], debounceTimer: NodeJS.Timeout) {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    console.log(`fetch request from independent debounceFetch() call!`);

    updateWaterLevel(dateKey, updatedTotal)
  });
}

export async function updateWaterLevel(dateKey: string, level: number[]) {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(level),
  };

  try {
    const res = await fetch(`http://localhost:3001/water/${dateKey}`, options);
    const json = await res.json();
  }
}
