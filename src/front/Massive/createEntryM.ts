import { v4 as uuid } from 'uuid';
import { isoDateKey } from '../../utils/dateKey';

// import { createRoutine } from '../Routines/createRoutine';

export interface ListProps {
  [dateKey: string]: string[];
}

export interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}
export interface EntryProps {
  id: string;
  date: string;
  routines: RoutineProps[];
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

// TODO: argument for current param to be determined by either current routine list (if creating the next consecutive day) or newest list that is <= date argument
export function createEntry(current: string[] = [], date?: string): EntryProps {
  const routines = current.map((name: string) => createRoutine(name));

  return {
    id: uuid(),
    date: date ? date : isoDateKey(),
    routines: routines,
  };
}

// TODO: same as fetchEntry in useEntry hook so delete one or the other
export async function requestEntry(entryDate: string) {
  try {
    const res = await fetch(`http://localhost:3001/entry/${entryDate}`);

    if (!res.ok) {
      throw new Error('Network response error.');
    }

    const data = await res.json();
    // console.log(data);
    return data;
  } catch (err) {
    console.error('Network response error.', err);
    return null; // indicate failure
  }
}

function backToIso(x: number) {
  return new Date(x).toISOString().split('T')[0];
}
export function youngestBefore(allLists: number[], dateMatch: number) {
  return allLists.reduce((mostRecent, current) => {
    if (current <= dateMatch && current > mostRecent) {
      return current;
    }
    return mostRecent;
  }, 0);
}

export function oldestAfter(allLists: number[], dateMatch: number) {
  return allLists.reduce((mostRecent, current) => {
    if (current >= dateMatch && current < mostRecent) {
      return current;
    }
    return mostRecent;
  }, 0);
}

function listWithKey(num: number, routineLists: ListProps) {
  const key = backToIso(num);
  return routineLists[key];
}

export async function findAppropriateRoutineList(dateToMatch: string) {
  const routineList = [];
  const match = new Date(dateToMatch).getTime();
  try {
    const res = await fetch(`http://localhost:3001/list/`);
    const json = await res.json();

    // TODO: move sort to server side so fetched json is always presorted
    const orderedDates = Object.keys(json)
      .map((x) => new Date(x).getTime())
      .sort((a, b) => a - b);

    const before = youngestBefore(orderedDates, match);
    const after = oldestAfter(orderedDates, match);

    if (before !== after) {
      // prompt user
      routineList.push(listWithKey(before, json));
      routineList.push(listWithKey(after, json));
    } else {
      routineList.push(listWithKey(before, json));
    }
  } catch (err) {
    console.log(err);
  }
  return routineList;
}
