import { v4 as uuid } from 'uuid';

export function dateKey(unixTime?: number) {
  unixTime = unixTime ?? Date.now();

  const local = new Date(unixTime).toLocaleDateString();

  const parts = local.split('/');
  return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
}

export interface EntryProps {
  id: string;
  date: string;
  routines: RoutineProps[];
}

export interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}

export interface EntriesObjectProps {
  [date: string]: EntryProps;
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
    date: date ? date : dateKey(),
    routines,
  };
}
