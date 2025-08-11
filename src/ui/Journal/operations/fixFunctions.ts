import { v4 as uuid } from 'uuid';
import { EntryProps, RoutineProps } from '../types';

// TODO: change function name because we're no longer using the ISOString method.
// create a string formatted date usable as key
export function isoDateKey(unixTime?: number) {
  unixTime = unixTime ?? Date.now();

  const local = new Date(unixTime).toLocaleDateString();

  const parts = local.split('/');
  const convert = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  return convert;
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

export async function fetchEntry(date: string) {
  try {
    const res = await fetch(`http://localhost:3001/entry/${date}`);

    if (!res.ok) {
      throw new Error(`Unable to fetch entry. Response not ok.`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Network response error. ${err}`);
    return null;
  }
}

export function yesterdayDateKey(unixTime?: number) {
  const unix = unixTime ?? Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const local = new Date(unix - oneDay).toLocaleDateString();

  const parts = local.split('/');
  console.log('CONVERT');
  const convert = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  return convert;
}
