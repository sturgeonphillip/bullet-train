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
    res.send(data);
  } catch (err) {
    handleError(err, res, 'Error reading entries from database.');
  }
};

const getEntry = async (req: Request, res: Response) => {
  try {
    console.log(req.params.date);
    const byDate = req.params.date;
    const data = await fs.readFile(filePath, 'utf8');
    const entries = JSON.parse(data);

    const entry = entries[byDate];

    if (entry) {
      res.send(entry);
    } else
      res
        .status(404)
        .send({ message: 'Entry not found for the specific date.' });
  } catch (err) {
    handleError(err, res, 'Error reading entry from database.');
  }
};

// redundant dept of theoretical redundancy
const getEntryRoutine = async (req: Request, res: Response) => {
  try {
    const byDate = req.body.date;
    const id = byDate.id;
    const data = await fs.readFile(filePath, 'utf8');
    const entry = data[byDate];
    const routine = entry[id];
    res.send(routine);
  } catch (err) {
    handleError(err, res, 'Error reading entry from database.');
  }
};

const createEntry = async (req: Request, res: Response) => {
  console.log('REQ BODY', req.body);
  try {
    let existingData = {};
    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(content);

      // console.log('createEntry[EXISTDATA]:', existingData);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, `Error reading file contents: ${err}`);
      }
    }

    console.log('rpd', req.body.date);
    // const createdEntry = {};

    const allEntries = {
      ...existingData,
      // [req.params.date]: req.body,
      [req.body.date]: req.body,
    };

    await fs.writeFile(filePath, JSON.stringify(allEntries), 'utf8');
    // console.log(createdEntry);
    // console.log(allEntries);
    res.status(201).json(allEntries);
  } catch (err) {
    handleError(err, res, 'Error writing new entry.');
  }
};

const updateEntry = async (req: Request, res: Response) => {
  try {
    let existingData = {};
    // updateEntry

    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(content);

      // console.log('updateEntry[EXISTDATA]:', existingData);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, 'Error reading file contents: ');
      }
    }
    const key = req.body.date;
    const val = req.body;

    const allEntries = {
      ...existingData,
      [key]: val,
    };
    await fs.writeFile(filePath, JSON.stringify(allEntries), 'utf8');
  } catch (err) {
    handleError(err, res, 'HANDLED!');
  }
};

const updateEntryRoutine = async (req: Request, res: Response) => {
  try {
    // updateEntryRoutine
  } catch (err) {
    handleError(err, res, 'HANDLED!');
  }
};

const destroyEntry = async (req: Request, res: Response) => {
  try {
    // destroyEntry
  } catch (err) {
    handleError(err, res, 'HANDLED!');
  }
};

const destroyEntryRoutine = async (req: Request, res: Response) => {
  try {
    // destroyEntryRoutine
  } catch (err) {
    handleError(err, res, 'HANDLED!');
  }
};

export {
  getEntries,
  getEntry,
  getEntryRoutine,
  createEntry,
  updateEntry,
  updateEntryRoutine,
  destroyEntry,
  destroyEntryRoutine,
};

// const csdeateEntry = async (req: Request, res: Response) => {
//   try {
//     let existingData = {};
//     try {
//       const content = await fs.readFile(filePath, 'utf8');
//       existingData = JSON.parse(content);

//       console.log('createEntry[EXISTDATA]:', existingData);
//     } catch (err) {
//       if (err instanceof SyntaxError) {
//         existingData = {};
//       } else {
//         handleError(err, res, `Error reading file contents: ${err}`);
//       }
//     }
//     const key = await req.body.date;
//     const val = await req.body;
//     const allEntries = {
//       ...existingData,
//       [key]: val,
//     };

//     await fs.writeFile(filePath, JSON.stringify(allEntries), 'utf8');
//   } catch (err) {
//     handleError(err, res, 'Error writing new entry.');
//   }
// };

/**
 * "2024-02-29": {
    "date": "2024-02-29",
    "routines": [
      {
        "complete": false,
        "id": "1bdabaf5-a0e1-4b9b-be33-d183588c1898",
        "name": "Walk Dogs",
        "timestamp": 0
      },
      {
        "complete": false,
        "id": "45efc5b5-ce31-4468-8ce9-d37b417607fe",
        "name": "Pray",
        "timestamp": 0
      },
      {
        "complete": false,
        "id": "e47efb18-4a31-41b7-a18c-7042500db226",
        "name": "Row",
        "timestamp": 0
      }
    ]
  }
 */
