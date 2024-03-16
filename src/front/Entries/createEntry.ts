import { v4 as uuid } from 'uuid';
import { isoDateKey } from '../../utils/dateKey';
import { createRoutine } from '../Routines/createRoutine';

interface RoutineProps {
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

export function createEntry(current: string[]): EntryProps {
  const routines = current.map((name: string) => createRoutine(name));

  return {
    id: uuid(),
    date: isoDateKey(),
    routines: routines,
  };
}

export async function requestEntry(entryDate: string) {
  try {
    const res = await fetch(`http://localhost:3001/entry/${entryDate}`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Network response error.', err);
    return;
    return null; // indicate failure
  }
}
// const active = ['Pray', 'Walk Dogs', 'Row'];
// console.log(createEntry(active));
