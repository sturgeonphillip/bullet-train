import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

import { handleError } from '../../../utils/errorHandler';
// import { sortEntries } from '../../../utils/sortEntries';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../../../db/entries.json');

export const getEntries = async (_req: Request, res: Response) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');

    res.status(200).send(data);
  } catch (err) {
    handleError(err, res, 'Error reading entries from database.');
  }
};

export const getEntry = async (req: Request, res: Response) => {
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

// redundant dept of theoretical redundancy
export const getEntryRoutine = async (req: Request, res: Response) => {
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
export const getEntryByDate = async (date: string) => {
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

// TODO: clean out all console.log() statements
// TODO: write meaningful error statements and healthy comments
