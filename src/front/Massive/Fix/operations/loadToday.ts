import { EntryProps } from '../types';
import { isoDateKey, createEntry } from './fixFunctions';
import { ListProps } from '../types';
import { Dispatch, SetStateAction } from 'react';

export async function loadToday(entryDate?: string) {
  const today = entryDate ?? isoDateKey();
  // try to fetch the entry for today
  try {
    const res = await fetch(`http://localhost:3001/entry/${today}`);

    if (!res.ok) {
      console.log(`Error request for ${today} on loadToday().`);
      const todayEntry = await buildTodayEntry(today);

      const newEntryData = await postTodayEntry(today, todayEntry);
      console.log('created new entry', newEntryData[today]);
      return newEntryData;
    }

    const data = await res.json();
    console.log('fetched entry from db', data);
    return data;
  } catch (err) {
    console.error('Network response error.', err);
    return null; // indicate failure
  }
  // if it doesn't exist yet, create it

  // then, setEntryDate(today)
}

// build a new entry for today
export async function buildTodayEntry(todayInput: string) {
  let storedLists: ListProps = {};

  // TODO: move logic of getting yesterday's entries to the server and just return the most recent entries
  try {
    const res = await fetch(`http://localhost:3001/list/`);
    if (!res.ok) {
      throw new Error('Network response error.');
    }

    storedLists = await res.json();
  } catch (err) {
    console.error(`Caught error in handleToday function: ${err}`);
  }

  const lastListTimes = Object.keys(storedLists)
    .map((x) => new Date(x).getTime())
    .sort((a, b) => a - b);

  const lastList = new Date(lastListTimes[lastListTimes.length - 1])
    .toISOString()
    .split('T')[0];

  const todayList = storedLists[lastList];

  return createEntry(todayList, todayInput);
}

buildTodayEntry('2024-05-11');

// post new entry to the db
export async function postTodayEntry(todayDate: string, entry: EntryProps) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  };
  try {
    const response = await fetch(
      `http://localhost:3001/entry/${todayDate}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Error while writing new entry into the database.`);
    }
    return response.json();
  } catch (err) {
    console.error(`Caught error: ${err}.`);
  }
}

export async function createEntryForToday(todayDate: string) {
  const newEntry = buildTodayEntry(todayDate);

  const options = {
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEntry),
  };

  try {
    const response = await fetch(
      `http://localhost:3001/entry/${todayDate}`,
      options
    );
    if (!response.ok) {
      throw new Error(`Error while creating new entry: ${response.statusText}`);
    }

    const createdEntry = await response.json();
    return createdEntry;
  } catch (err) {
    console.error(`Error creating entry for today: ${err}`);
    return null;
  }
}

export async function fetchOrCreateTodayEntry(
  entryDate: string,
  setEntry: Dispatch<SetStateAction<EntryProps | null>>
) {
  const today = entryDate ?? isoDateKey();
  const data = await loadToday(today);

  if (data) {
    setEntry(data);
  } else {
    // If data is null, it means the entry for today does not exist and needs to be created
    const createdEntry = await createEntryForToday(today);
    if (createdEntry) {
      setEntry(createdEntry);
    }
  }
}
