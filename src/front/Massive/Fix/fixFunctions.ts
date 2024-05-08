import { v4 as uuid } from 'uuid';
import { EntryProps, RoutineProps } from './types';

// create a string formatted date usable as key
export function isoDateKey(unixTime?: number) {
  unixTime = unixTime ?? Date.now();
  return new Date(unixTime).toISOString().split('T')[0];
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

// function listWithKey() {}

// function handleToday() {}

// function getTimeCode() {}

// function findPrecedingSucceedingPoints() {}

// function fetchToday() {}
