import { BottleStateProps } from '../HydrationTracker';
import { debounceAsync } from './debounceAsync';

const patchBottle = async (dateKey: string, bottle: BottleStateProps) => {
  await fetch(`/api/hydration/${dateKey}/${bottle.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ounces: bottle.ounces }),
  });
};

export const debouncePatchBottle = debounceAsync(patchBottle, 500);
