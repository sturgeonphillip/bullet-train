import { debounceAsync } from './debounceAsync';

const patchTotalOunces = async (
  dateKey: string,
  total: number,
  i: number = 1
) => {
  console.log('patchTotalOunces!', i);
  await fetch(`http://localhost:3001/hydration/${dateKey}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ totalOunces: total }),
  });
};

export const debouncePatchTotalOunces = debounceAsync(patchTotalOunces, 500);
