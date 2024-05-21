import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';
import { handleError } from '../../../utils/errorHandler';
import { sortEntries } from '../../../utils/sortEntries';
import {
  createEntry,
  EntryProps,
  RoutineProps,
  EntriesObjectProps,
} from '../../factories';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../../../db/entries.json');

// TODO: compare this with createTodayEntry to see if there's a way to reduce redundancy by refactoring.
export const createEntryByDate = async (req: Request, res: Response) => {
  try {
    const entryDate = req.params.date;
    let existingData = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');

      existingData = await JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, 'Error reading existing content from file.');
      }
    }

    const entryBody = req.body;

    const allEntries = {
      ...existingData,
      [entryDate]: entryBody,
    };

    const sorted = sortEntries(allEntries);

    await fs.writeFile(filePath, JSON.stringify(sorted), 'utf8');

    res.status(201).json(allEntries);
  } catch (err) {
    handleError(err, res, 'Error while writing new entry.');
  }
};

export const createTodayEntry = async (req: Request, res: Response) => {
  try {
    let existingData: { [key: string]: EntryProps } = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = await JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, 'Error reading existing content from file.');
      }
    }

    console.log('existing data', existingData);

    const entryKey = req.params.date;

    if (existingData[entryKey]) {
      console.log(`WARNING: There is already an entry for today, ${entryKey}.`);
      return;
    }

    const entryData = await createTodayFromYesterday(entryKey);

    const allEntries: EntriesObjectProps = {
      ...existingData,
      [entryKey]: entryData,
    };

    const sorted = sortEntries(allEntries);

    await fs.writeFile(filePath, JSON.stringify(sorted), 'utf8');

    res.status(201).json(entryData);
  } catch (err) {
    handleError(err, res, 'Error while writing new entry.');
  }
};

export async function createTodayFromYesterday(date: string) {
  let todayEntry;
  let routineList;
  const yesterday = yesterdayDate(date);

  try {
    const existingEntry = await getEntryByDate(date);
    if (!existingEntry) {
      console.log(
        `INFO: No entry found for today, ${date}. Entry will be created using routines from ${yesterday}. Creating now...`
      );

      const yesterdayEntry = await getEntryByDate(yesterday);

      if (!yesterdayEntry) {
        // go back to most recent entry list
        // use sorted entries to find last/most recent
        const mostRecent = await getMostRecentExistingEntry();
        if (mostRecent) {
          routineList = mostRecent['routineList'];
        }
      } else {
        routineList = yesterdayEntry.routines.map((x: RoutineProps) => x.name);
      }

      todayEntry = createEntry(routineList, date);

      return todayEntry;
    } else {
      console.log(`Return existing entry: ${existingEntry}`);

      return existingEntry;
    }
  } catch (err) {
    // TODO: log or handle error
    console.error(
      `ERROR: Error while creating today's entry from yesterday. ${err}`
    );
  }
}

export function yesterdayDate(date: string) {
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

export async function getEntryByDate(date: string) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const entries = JSON.parse(data);

    return entries[date];
  } catch (err) {
    console.error(`Error reading entry by date: ${err}`);

    return null;
  }
}

export async function getMostRecentExistingEntry() {
  // let existingData;
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
    console.error(`ERROR at getMostRecentExistingEntry: ${err}`);
  }
}

// TODO: write functions like findAdjacentLists on the server side.

// console.log(yesterdayDate('2024-08-12'));
