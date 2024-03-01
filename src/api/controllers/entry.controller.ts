import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

import { handleError } from '../../utils/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../../db/entries.json');

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
    const entries = JSON.parse(data);

    const entry = entries[byDate];

    if (entry) {
      res.status(200).send(entry);
    } else
      res
        .status(404)
        .send({ message: 'Entry not found for the specified date.' });
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

const createEntry = async (req: Request, res: Response) => {
  try {
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

    const entryKey = req.params.date;
    const entryData = req.body;
    const allEntries = {
      ...existingData,
      [entryKey]: entryData,
    };

    await fs.writeFile(filePath, JSON.stringify(allEntries), 'utf8');
    res.status(201).json(allEntries);
  } catch (err) {
    handleError(err, res, 'Error while writing new entry.');
  }
};

const updateEntry = async (req: Request, res: Response) => {
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
        handleError(err, res, 'Error reading file contents.');
      }
    }
    console.log('PRE', existingData);

    let entry: EntryProps = existingData[entryKey];

    entry = { ...req.body };
    existingData[entryKey] = entry;

    console.log('POST', existingData);
    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');

    res.status(204).send();
  } catch (err) {
    handleError(err, res, 'Error updating entry.');
  }
};

// const updateEntryRoutine = async (req: Request, res: Response) => {
//   try {
//     // updateEntryRoutine
//   } catch (err) {
//     handleError(err, res, 'HANDLED!');
//   }
// };

const destroyEntry = async (req: Request, res: Response) => {
  try {
    // destroyEntry
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
        return;
      }
    }

    if (!Object.prototype.hasOwnProperty.call(existingData, entryKey)) {
      res
        .status(404)
        .send({ message: `Entry not found for specified date (${entryKey}.)` });
      return;
    }

    console.log('PRE', existingData);
    delete existingData[entryKey];
    console.log('POST', existingData);

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
  createEntry,
  updateEntry,
  // updateEntryRoutine,
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
