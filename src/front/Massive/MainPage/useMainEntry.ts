import { v4 as uuid } from 'uuid';

interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}

export interface RoutineListProps {
  [dateKey: string]: string[];
}

export interface EntryProps {
  id: string;
  dateKey: string;
  routines: RoutineProps[];
}

export interface HandleSubmitProps {
  event: React.FormEvent<HTMLFormElement>;
  entryDate: string;
  setDisplayCarriage: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useMainEntry() {
  // form submission
  function handleSubmit({
    event,
    entryDate,
    setDisplayCarriage,
  }: HandleSubmitProps) {
    event.preventDefault();
    if (!entryDate) {
      setDisplayCarriage(true);
    }
    console.log();
  }

  function isoDateKey() {
    return new Date(Date.now()).toISOString().split('T')[0];
  }

  function createRoutine(name: string): RoutineProps {
    name = name ?? '[EMPTY]';
    return {
      id: uuid(),
      name,
      complete: false,
      timestamp: 0,
    };
  }

  // TODO: argument is determined in context.
  // 1. when entry for next consecutive date is auto-created using scheduled update (cron job)
  // 2. newest list that uses a non-consecutive date argument is less than current date sometime in the past or is a future date greater than current date
  function createEntry(current: string[] = [], date?: string): EntryProps {
    const routines = current.map((name: string) => createRoutine(name));

    return {
      id: uuid(),
      dateKey: date ? date : isoDateKey(),
      routines,
    };
  }

  async function fetchEntry(entryDate: string) {
    try {
      const res = await fetch(`http://localhost:3001/entry/${entryDate}`);

      if (!res.ok) {
        throw new Error('Network response error.'); // TODO: more specific error message
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Network response error.', err);
      return null; // indicates failure
    }
  }

  async function findAppropriateRoutineList(dateToMatch: string) {
    const routineList = [];
    const match = new Date(dateToMatch).getTime();

    try {
      const res = await fetch(`http://localhost:3001/list/`);
      const json = await res.json();

      // TODO: move orderedDates to server side so fetched data is always presorted
      const orderedDates = Object.keys(json)
        .map((x) => new Date(x).getTime())
        .sort((a, b) => a - b);

      const before = oldestBefore(orderedDates, match);
      const after = oldestAfter(orderedDates, match);

      routineList.push(listWithKey(before, json));

      if (before !== after) {
        routineList.push(listWithKey(after, json));
      }
    } catch (err) {
      console.error(err);
    }

    return routineList;
  }

  function oldestBefore(allLists: number[], dateMatch: number) {
    return allLists.reduce((mostRecent, current) => {
      if (current <= dateMatch && current > mostRecent) {
        return current;
      }
      return mostRecent;
    }); // explicitly use first index
  }

  function oldestAfter(allLists: number[], dateMatch: number) {
    return allLists.reduce((leastRecent, current) => {
      if (current > dateMatch && current < leastRecent) {
        return current;
      }
      return leastRecent;
    }); // explicitly use first index
  }

  function listWithKey(num: number, routineLists: RoutineListProps) {
    const key = new Date(num).toISOString().split('T')[0];
    return [key, routineLists[key]];
  }

  return {
    handleSubmit,
    isoDateKey,
    createRoutine,
    createEntry,
    fetchEntry,
    findAppropriateRoutineList,
    listWithKey,
  };
}

export default useMainEntry;
