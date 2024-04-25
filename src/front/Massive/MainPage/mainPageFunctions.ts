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

export function fromUnix(unixTime: number) {
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

// retrieves entry from database
export async function fetchEntry(date: string) {
  try {
    const res = await fetch(`http://localhost:3001/entry/${date}`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    // TODO: change error messaging
    console.error('Network response error.', err);
    return null;
  }
}

// format tuple [date, [routines]]
function listWithKey(num: number, routineLists: ListProps): ListOptionProps {
  const key = new Date(num).toISOString().split('T')[0];

  return [key, routineLists[key]];
}

export async function handleToday() {
  let storedLists: ListProps = {};

  try {
    const res = await fetch(`http://localhost:3001/list/`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }

    storedLists = await res.json();
  } catch (err) {
    console.error('Neetwork response error.', err);
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayFormatted = yesterday.toISOString().split('T')[0];
  const todayFormatted = today.toISOString().split('T')[0];

  const todayList = storedLists[yesterdayFormatted];

  // TODO: once entry is created, still need to send it to entries db
  // return createEntry(todayList, todayFormatted);
  const created = createEntry(todayList, todayFormatted);

  // TODO: this needs revision
  //  currently getting error network response not ok
  // try {
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(created),
  //   };

  //   const res = await fetch(
  //     `http:localhost:3001/entries/${todayFormatted}`,
  //     options
  //   );
  //   if (!res.ok) {
  //     throw new Error('Network response is not ok.');
  //   }
  // } catch (err) {
  //   console.error("Error adding today's entry to database.", err);
  // }
}

export async function findSurroundingLists(inputDate: string) {
  const routineLists: ListOptionProps[] = [];
  let storedLists: ListProps = {};

  const midpoint = new Date(inputDate).getTime();

  try {
    const res = await fetch(`http://localhost:3001/list/`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }

    storedLists = await res.json();
  } catch (err) {
    console.error(err);
  }

  const keys = Object.keys(storedLists);

  const timecodes = keys.map((x) => new Date(x).getTime());

  timecodes.push(midpoint);
  timecodes.sort((a, b) => a - b);

  const midIdx = timecodes.indexOf(midpoint);

  const before = midIdx > 0 ? timecodes[midIdx - 1] : timecodes[midIdx];
  const after =
    midIdx < timecodes.length - 1 ? timecodes[midIdx + 1] : timecodes[midIdx];

  routineLists.push(listWithKey(before, storedLists));
  routineLists.push(listWithKey(after, storedLists));

  return routineLists;
}

(async () => {
  await handleToday();
})();
