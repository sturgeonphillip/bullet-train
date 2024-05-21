import { ListProps, EntryProps } from './mainPageTypes';
import { createEntry, fetchEntry, listWithKey } from './mainPageFunctions';

export function isoDateKey() {
  return new Date(Date.now()).toISOString().split('T')[0];
}

export async function handleToday(today?: string) {
  today = today ?? isoDateKey();
  let todayEntry: EntryProps;
  todayEntry = await fetchEntry(today);

  if (!todayEntry) {
    console.log('NO Entry for today. Creating now...');
    todayEntry = createEntry();
  } else {
    console.log('today SUCKS!');
  }
  console.log('TODAY:', todayEntry);
}

handleToday('2024-05-04');

export async function createToday() {
  let storedLists: ListProps = {};

  try {
    const res = await fetch(`http://localhost:3001/list/`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }

    storedLists = await res.json();
  } catch (err) {
    console.error(`Caught error in handleToday function: ${err}`);
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey = yesterday.toISOString().split('T')[0];

  const yesterdayList = storedLists[yesterdayKey];

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
    console.error(`Caught error while handling an entry for today: ${err}`);
  }

  return createToday;
}

// handleToday
