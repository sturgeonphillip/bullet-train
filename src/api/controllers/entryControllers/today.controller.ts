import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';
import { handleError } from '../../../utils/errorHandler';

import {
  dateKey,
  createEntry,
  EntryProps,
  RoutineProps,
  EntriesObjectProps,
} from '../../factories';
import { sortEntries } from '../../../utils/sortEntries';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../../../db/entries.json');

export const handleToday = async (_req: Request, res: Response) => {
  try {
    const entryDate = dateKey();
    const dataExists = await checkIfDataExists(entryDate);

    if (!dataExists) {
      const todayData = await createTodayFromYesterday(entryDate);
      if (todayData) {
        await writeToDatabase(todayData, entryDate);
        res.status(201).send(JSON.stringify(todayData));
      }
    } else {
      const data = await getEntryByDate(entryDate);
      res.status(201).send(JSON.stringify(data));
    }
  } catch (err) {
    handleError(err, res, 'Error while running the handleToday function.');
  }
};

async function checkIfDataExists(date: string) {
  let existingData: { [key: string]: EntryProps } = {};

  try {
    const byDate = date;
    const data = await fs.readFile(filePath, 'utf8');
    existingData = await JSON.parse(data);

    const dataCheck = existingData[byDate];

    if (!dataCheck) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error(`Error checking if data exists: ${err}`);
  }
}

async function createTodayFromYesterday(today: string) {
  let todayEntry;
  let routineList;
  const yesterday = yesterdayDate(today);

  try {
    const yesterdayEntry = await getEntryByDate(yesterday);

    if (!yesterdayEntry) {
      const mostRecent = await getMostRecentExistingEntry();

      if (mostRecent) {
        routineList = mostRecent['routineList'];
      }
    } else {
      routineList = yesterdayEntry.routines.map((x: RoutineProps) => x.name);
    }

    todayEntry = createEntry(routineList, today);

    return todayEntry;
  } catch (err) {
    console.error(
      `Error: Error while creating today's entry from yesterday. ${err}`
    );
  }
}

function yesterdayDate(date: string) {
  let today;
  if (typeof date === 'string') {
    today = new Date(date).getTime();
  } else {
    today = Date.now();
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const yesterday = new Date(today - oneDay).toISOString().split('T')[0];

  return yesterday;
}

async function getEntryByDate(entryDate: string) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const entries = JSON.parse(data);

    return entries[entryDate];
  } catch (err) {
    console.error(`Error reading entry by date: ${err}`);

    return null;
  }
}

async function getMostRecentExistingEntry() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);

    const entryTuples: [string, EntryProps][] | undefined = Object.entries(
      json
    ).map(([key, val]) => [key, val as EntryProps]);

    const mostRecent = entryTuples[entryTuples.length - 1];

    return {
      date: mostRecent[0],
      routineList: mostRecent[1]['routines'].map((x) => x.name),
    };
  } catch (err) {
    console.error(`ERROR at getMostRecentExistingEngtry: ${err}`);
  }
}

async function writeToDatabase(entry: EntryProps, entryDate: string) {
  let existingData: EntriesObjectProps = {};

  try {
    const content = await fs.readFile(filePath, 'utf8');
    existingData = await JSON.parse(content);
  } catch (err) {
    if (err instanceof SyntaxError) {
      existingData = {};
    } else {
      console.error(`Error writing new data to database. ${err}`);
    }
  }

  const allEntries = {
    ...existingData,
    [entryDate]: entry,
  };

  const sorted = sortEntries(allEntries);

  await fs.writeFile(filePath, JSON.stringify(sorted), 'utf8');

  return allEntries;
}
