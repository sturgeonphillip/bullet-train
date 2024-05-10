import { EntryProps } from '../types';
import { isoDateKey, createEntry } from './fixFunctions';
import { ListProps } from '../types';

export async function loadToday() {
  const today = isoDateKey();
  // try to fetch the entry for today
  try {
    const res = await fetch(`http://localhost:3001/entry/${today}`);

    if (!res.ok) {
      // throw new Error('Network response error.');
      const todayEntry = await buildTodayEntry(today);
      const newData = await createToday(today, todayEntry);
      console.log('new data', newData);
      return newData;
    }

    const data = await res.json();
    console.log('data', data);
    return data;
  } catch (err) {
    console.error('Network response error.', err);
    return null; // indicate failure
  }
  // if it doesn't exist yet, create it

  // then, setEntryDate(today)
}

export async function buildTodayEntry(todayInput: string) {
  let storedLists: ListProps = {};

  // TODO: move logic of getting yesterday's entries to the server and just returning the most recent entries
  try {
    const res = await fetch(`http://localhost:3001/list/`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }

    storedLists = await res.json();
  } catch (err) {
    console.error(`Caught error in handleToday function: ${err}`);
  }

  const today = new Date(todayInput);
  console.log('today', today);

  const yesterday = today.setDate(today.getDate() - 1);

  console.log('YESTERDAY', yesterday);
  const yesterdayKey = isoDateKey(Number(yesterday));
  console.log('yesterdayKey', yesterdayKey);

  console.log('SL', storedLists);
  const lastListTimes = Object.keys(storedLists)
    .map((x) => new Date(x).getTime())
    .sort((a, b) => a - b);

  const lastList = new Date(lastListTimes[lastListTimes.length - 1])
    .toISOString()
    .split('T')[0];

  const todayList = storedLists[lastList];

  return createEntry(todayList, todayInput);
}

export async function createToday(today: string, entry: EntryProps) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  };

  const response = await fetch(`http://localhost:3001/entry/${today}`, options);

  return response.json();
}

loadToday();
