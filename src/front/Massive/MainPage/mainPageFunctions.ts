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

export async function handleToday(date: string) {
  try {
    const res = await fetch(`http://localhost:3001/entry/${date}`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error('Neetwork response error.', err);
  }
}

// format tuple [date, [routines]]
function listWithKey(num: number, routineLists: ListProps): ListOptionProps {
  const key = new Date(num).toISOString().split('T')[0];

  return [key, routineLists[key]];
}

// const ordered = [
//   1708473600000, 1708646400000, 1710547200000, 1711411200000, 1711929600000,
// ];

export async function findSurroundingLists(inputDate: string) {
  const routineLists: ListOptionProps[] = [];
  let storedLists: ListProps = {};

  const midpoint = new Date(inputDate).getTime();

  try {
    const res = await fetch(`http://localhost:3001/list/`);
    const json = await res.json();

    storedLists = await json;
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

  // const beforeDate = new Date(before).toISOString().split('T')[0];

  // const afterDate = new Date(after).toISOString().split('T')[0];

  routineLists.push(listWithKey(before, storedLists));
  routineLists.push(listWithKey(after, storedLists));

  console.log(
    'rL',
    routineLists,
    midIdx,
    // beforeDate,
    '|',
    // afterDate,
    '|',
    'sort timecodes',
    timecodes
    // timecodes.sort((a, b) => a - b)
  );
}

(async () => {
  console.log('findRoutineLists...');
  const r = await findSurroundingLists('2024-03-17');
  console.log(r);
})();
