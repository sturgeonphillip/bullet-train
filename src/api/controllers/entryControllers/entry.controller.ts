import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

import { handleError } from '../../../utils/errorHandler';
import { sortEntries } from '../../../utils/sortEntries';
// import { createEntry } from '../factories';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../../../db/entries.json');

const getEntries = async (_req: Request, res: Response) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    res.status(200).send(data);
  } catch (err) {
    handleError(err, res, 'Error reading entries from database.');
  }
};

const getEntry = async (req: Request, res: Response) => {
  try {
    const byDate = req.params.date;
    const data = await fs.readFile(filePath, 'utf8');
    const entries = await JSON.parse(data);

    const entry = entries[byDate];

    if (entry) {
      res.status(200).json(entry);
    } else {
      res
        .status(404)
        .send({ message: 'Entry not found for the specified date.' });
    }
  } catch (err) {
    handleError(err, res, 'Error reading entry from database.');
  }
};

// TODO: clean out all console.log() statements
// TODO: write proper healthy comments

// redundant dept of theoretical redundancy
const getEntryRoutine = async (req: Request, res: Response) => {
  try {
    const byDate = req.body.date;
    const id = byDate.id;
    const data = await fs.readFile(filePath, 'utf8');
    const entry = data[byDate];
    const routine = entry[id];
    res.status(200).send(routine);
  } catch (err) {
    handleError(err, res, 'Error reading entry routine from database.');
  }
};

// GET and POST revision
// assumes a function to get an entry by date
const getEntryByDate = async (date: string) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const entries = JSON.parse(data);
    return entries[date];
  } catch (err) {
    console.error('Error reading entry:', err);
    // returning null is useful because it allows the calling code to handle the error gracefully without having to deal with the error directly within the getEntryByDate function, and it keeps the function's signature simple because it always returns a value (either the entry object or null).
    return null;
  }
};

const createEntryByDate = async (req: Request, res: Response) => {
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

    res.status(201).json(sorted);
  } catch (err) {
    handleError(err, res, 'Error while writing new entry.');
  }
};

const updateEntry = async (req: Request, res: Response) => {
  try {
    const entryKey = req.params.date;
    const updatedRoutines = req.body.routines;

    console.log('UPDATEDROUTINES', updatedRoutines);
    let existingData: { [key: string]: EntryProps } = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, 'Error reading file contents.');
      }
    }

    // console.log('PRE', existingData);

    let entry: EntryProps = existingData[entryKey];

    entry = { ...req.body };
    existingData[entryKey] = entry;

    // console.log('POST', existingData);
    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');

    res.status(204).send();
  } catch (err) {
    handleError(err, res, 'Error updating entry.');
  }
};

const destroyEntry = async (req: Request, res: Response) => {
  try {
    const entryKey = req.params.date;
    let existingData: { [key: string]: EntryProps } = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, `Error reading file contents: ${err}`);
      }
    }

    if (!Object.prototype.hasOwnProperty.call(existingData, entryKey)) {
      res
        .status(404)
        .send({ message: `Entry not found for specified date (${entryKey}).` });
      return;
    }

    delete existingData[entryKey];

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');
    res.status(204).send();
  } catch (err) {
    handleError(err, res, 'Error while deleting entry.');
  }
};

const destroyEntryRoutine = async (req: Request, res: Response) => {
  try {
    const entryKey = req.params.date;
    const routineId = req.params.id;
    console.log(entryKey, routineId);

    let existingData: { [key: string]: EntryProps } = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, 'Error reading file contents.');
        return;
      }
    }

    console.log('EXISTINGDATA', existingData);
    if (Object.prototype.hasOwnProperty.call(existingData, entryKey)) {
      const entry: EntryProps = existingData[entryKey];

      console.log('ENTRY', entry);
      const routineIndex = entry.routine.findIndex(
        (routine) => routine.id === routineId
      );

      if (routineIndex !== -1) {
        // remove the routine from the array of routines
        entry.routine.splice(routineIndex, 1);

        console.log('SPLICE', entry);

        // update entry in existingData object
        existingData[entryKey] = entry;

        // write updated data back to the file
        console.log('writing updates:');
        console.log(JSON.stringify(existingData));
        await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');
        res.status(204).send();
      } else {
        res
          .status(404)
          .send({ message: `Routine not found for id (${routineId}).` });
      }
    } else {
      res.status(404).send({
        message: `Entry not found for specified date (${entryKey}).`,
      });
    }
  } catch (err) {
    handleError(err, res, 'Error while deleting the routine.');
  }
};

export {
  getEntries,
  getEntry,
  getEntryRoutine,
  getEntryByDate,
  createEntryByDate,
  updateEntry,
  destroyEntry,
  destroyEntryRoutine,
};

// TODO: move types out of controller
interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
}

interface EntryProps {
  date: string;
  routine: RoutineProps[];
}

// TODO: test performance in updateEntry with Object.assign
// is it better to create a new object or just write over the old existing one?

// function objectEquality(
//   objA: Record<string, unknown>,
//   objB: Record<string, unknown>
// ) {
//   const keysA = Object.keys(objA);
//   const keysB = Object.keys(objB);

//   if (keysA.length !== keysB.length) {
//     return false;
//   }

//   for (const key of keysA) {
//     if (!keysB.includes(key) || objA[key] !== objB[key]) {
//       return false;
//     }
//   }

//   return true;
// }

// create a new entry if it doesn't exist
// export const createEntryDoesntExist = async (date: string, entryData: any) => {
//   const existingEntry = await getEntryByDate(date);
//   if (!existingEntry) {
//     // no entry exists, proceed to create a new one
//     const newEntry = {
//       ...entryData,
//       date: date, // assumes date is part of entry data
//     };

//     // add logic to write the new entry to the database
//     console.log('Creating new entry:', newEntry);
//   } else {
//     console.log('Entry already exists for the given date.');
//   }
// };

// app.post('/create-entry', async (req, res) => {
//   const { date, entryData } = req.body;

//   // check if an entry already exists for the given date
//   const existingEntry = await getEntryByDate(date);
//   if (existingEntry) {
//     return res
//       .status(409)
//       .send({ message: 'Entry already exists for the given date.' });

//     // if none exists, proceed to create a new entry
//     const newEntry = {
//       ...entryData,
//       date: date,
//     };

//     // logic to write the new entry to database
//     await createNewEntry(newEntry);

//     res.status(201).send({ message: 'New entry created successfully.' });
//   }
// });

// async function getEntryByDate(entryDate: string) {
//   try {
//     const content = await fs.readFile(filePath, 'utf8');
//     const entries = JSON.parse(content);
//     return entries[entryDate];
//   } catch (err) {
//     console.error(`Error reading entry: ${err}`);
//     return null;
//   }
// }
