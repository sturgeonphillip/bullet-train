import { v4 as uuid } from 'uuid';
import {
  EntryProps,
  ListProps,
  ListOptionProps,
  RoutineProps,
} from './mainPageTypes';

// create string formatted date usable as key
export function isoDateKey() {
  return new Date(Date.now()).toISOString().split('T')[0];
}

// turns a unix format to string date
// 1715043960527 -> 2024-05-07
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
      throw new Error('Network response error while fetching entry.');
    }

    const data = await res.json();
    // console.log('DATA', data);
    return data;
  } catch (err) {
    // TODO: change error messaging
    console.error('Network response error.', err);
    return null;
  }
}

// format tuple [date, [routines]]
export function listWithKey(
  num: number,
  routineLists: ListProps
): ListOptionProps {
  const key = new Date(num).toISOString().split('T')[0];

  return [key, routineLists[key]];
}

export async function handleToday() {
  // first needs to check if today's entry exists

  let storedLists: ListProps = {};

  try {
    const res = await fetch(`http://localhost:3001/list/`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }

    storedLists = await res.json();
  } catch (err) {
    console.error('Network response error.', err);
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayFormatted = yesterday.toISOString().split('T')[0];

  const yesterdayList = storedLists[yesterdayFormatted];
  let todayList;

  if (!yesterdayList) {
    const lastListTimes = Object.keys(storedLists)
      .map((x) => new Date(x).getTime())
      .sort((a, b) => a - b);

    todayList = listWithKey(
      lastListTimes[lastListTimes.length - 1],
      storedLists
    )[1];
  } else {
    todayList = yesterdayList;
  }

  const todayFormatted = today.toISOString().split('T')[0];
  const createToday = createEntry(todayList, todayFormatted);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createToday),
  };

  // post to entries db
  try {
    const res = await fetch(
      `http://localhost:3001/entry/${todayFormatted}`,
      options
    );

    if (!res.ok) {
      throw new Error(
        "Network response is not ok while posting today's entry."
      );
    }
  } catch (err) {
    console.error('Caught Error:', err);
  }

  return createToday;
}

// convert date string to a timecode
function getTimecode(dateString: string): number {
  return new Date(dateString).getTime();
}

// find appropriate points
export async function findPrecedingSucceedingPoints(
  inputDate: string
): Promise<[string, string] | null> {
  // const routineLists: ListOptionProps[] = [];
  // let storedLists: ListProps = {};

  const res = await fetch('http://localhost:3001/list/');
  if (!res.ok) {
    throw new Error('Network resonse error.');
  }

  const lists = await res.json();

  const sortedKeys = Object.keys(lists)
    .map(getTimecode)
    .sort((a, b) => a - b);

  const inputTimecode = getTimecode(inputDate);

  let precedingDate: string | null = null;
  let succeedingDate: string | null = null;

  for (const key of sortedKeys) {
    if (key < inputTimecode) {
      precedingDate = new Date(key).toISOString().split('T')[0];
    } else if (key > inputTimecode) {
      succeedingDate = new Date(key).toISOString().split('T')[0];
      // return [succeedingDate, []];
    }
  }

  if (precedingDate && succeedingDate) {
    return [precedingDate, succeedingDate];
  } else {
    return null;
  }
}
