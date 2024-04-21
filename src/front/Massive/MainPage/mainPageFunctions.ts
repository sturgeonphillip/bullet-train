import { v4 as uuid } from 'uuid';
import {
  EntryProps,
  ListProps,
  ListOptionProps,
  RoutineProps,
} from './mainPageTypes';

export function isoDateKey() {
  return new Date(Date.now()).toISOString().split('T')[0];
}

export function createRoutine(name: string): RoutineProps {
  name = name ?? '[EMPTY]';
  return {
    id: uuid(),
    name,
    complete: false,
    timestamp: 0,
  };
}

export function createEntry(current: string[] = [], date?: string): EntryProps {
  const routines = current.map((name: string) => createRoutine(name));
  return {
    id: uuid(),
    date: date ? date : isoDateKey(),
    routines,
  };
}

// retrieves entry from database
export async function fetchEntry(date: string) {
  try {
    const res = await fetch(`http://localhost:3001/entry/${date}`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }

    const data = await res.json();
    console.log('DATA');
    return data;
  } catch (err) {
    // TODO: change error messaging
    console.error('Network response error.', err);
    return null;
  }

  console.log('ROTATE');
}

// searches stored lists of routines to find the lists closest to
// input date (before and after) when creating a missing entry
export async function findAppropriateRoutineLists(
  dateToMatch: string
): Promise<ListOptionProps[]> {
  const routineList: ListOptionProps[] = [];
  const match = new Date(dateToMatch).getTime();

  try {
    const res = await fetch(`http://localhost:3001/list/`);
    const json = await res.json();

    const orderedDates = Object.keys(json)
      .map((x) => new Date(x).getTime())
      .sort((a, b) => a - b);

    // const before = oldestBefore(orderedDates, match);
    // const after = oldestAfter(orderedDates, match);

    const before = oldestBefore(orderedDates, match);
    const after = oldestAfter(orderedDates, match);

    console.log('b', before);
    console.log('a', after);
    routineList.push(listWithKey(before, json));
    if (before !== after) {
      routineList.push(listWithKey(after, json));
    }
  } catch (err) {
    console.error(err);
  }

  return routineList;
}

// finds date of oldest list subsequent to entry date
function oldestBefore(allLists: number[], dateMatch: number) {
  return allLists.reduce((mostRecent, current) => {
    if (current >= dateMatch && current < mostRecent) {
      return current;
    }
    return mostRecent;
  });
}

// finds the date of oldest list after entry date
function oldestAfter(allLists: number[], dateMatch: number) {
  return allLists.reduce((leastRecent, current) => {
    if (current <= dateMatch && current > leastRecent) {
      return current;
    }
    return leastRecent;
  });
}

// format routine lists into tuple
function listWithKey(num: number, routineLists: ListProps): ListOptionProps {
  const key = new Date(num).toISOString().split('T')[0];

  return [key, routineLists[key]];
}

(async () => {
  // const res = await fetchEntry('2024-02-29');
  // console.log('res', res);

  const res = await findAppropriateRoutineLists('2024-03-18');
  console.log('res', res);
})();
/**
 * // (async () => {
//   const res = await findAppropriateRoutineList('2024-02-29');
//   console.log('res', res);
// })();
 */

// const b = 1710547200000;
// const a = 1708473600000;
// console.log(b - a);
// console.log(a - b);
// console.log('before', new Date(b));
// console.log('after', new Date(a));
