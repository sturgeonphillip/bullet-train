import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

import { handleError } from '../../../utils/errorHandler';
// import { sortEntries } from '../../../utils/sortEntries';
import { EntryProps } from '../../factories';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../../../db/entries.json');

export const destroyEntry = async (req: Request, res: Response) => {
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

export const destroyEntryRoutine = async (req: Request, res: Response) => {
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
      const routineIndex = entry.routines.findIndex(
        (routine) => routine.id === routineId
      );

      if (routineIndex !== -1) {
        // remove the routine from the array of routines
        entry.routines.splice(routineIndex, 1);

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
