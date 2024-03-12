import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

import { handleError } from '../../utils/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../../db/list.json');

interface ExistingDataProps {
  [key: string]: string[];
}

// read all
const getRoutineList = async (_req: Request, res: Response) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    res.status(200).send(data);
  } catch (err) {
    handleError(err, res, 'Error reading entries from database.');
  }
};

// read one
const getRoutineByDate = async (req: Request, res: Response) => {
  try {
    const entryKey = req.params.date;
    let existingData: ExistingDataProps = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, 'Error reading existing content from file.');
      }
    }

    if (!Object.prototype.hasOwnProperty.call(existingData, entryKey)) {
      res
        .status(404)
        .send({ message: `Entry not found for specified date (${entryKey}).` });
    }

    res.status(200).send(JSON.stringify(existingData[entryKey]));
  } catch (err) {
    handleError(err, res, 'Error reading entries from database.');
  }
};

// create
const createRoutineList = async (req: Request, res: Response) => {
  try {
    let routineList: ExistingDataProps = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');
      routineList = await JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        routineList = {};
      } else {
        handleError(err, res, 'Error reading existing content from file.');
      }
    }

    const { addDate, addRoutineList } = await req.body;

    // if (!Object.prototype.hasOwnProperty.call(routineList, addDate)) {
    //   routineList[addDate] = [];
    // }
    routineList[addDate] = addRoutineList;

    await fs.writeFile(filePath, JSON.stringify(routineList), 'utf8');

    res.status(201).send(routineList);
  } catch (err) {
    handleError(err, res, 'Error while writing new entry.');
  }
};

// update
const updateRoutineList = async (req: Request, res: Response) => {
  try {
    const entryKey = req.params.date;
    let existingData: ExistingDataProps = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, 'Error reading existing content from file.');
      }
      return;
    }

    // TODO: be consistent in error messages (providing args)
    if (!Object.prototype.hasOwnProperty.call(existingData, entryKey)) {
      res
        .status(404)
        .send({ message: `Entry not found for specified date (${entryKey}).` });
    }

    existingData[entryKey] = req.body;

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');

    res.status(204).send();
  } catch (err) {
    handleError(err, res, 'Error updating entry.');
  }
};

// delete
const destroyRoutineList = async (req: Request, res: Response) => {
  try {
    const entryKey = req.params.date;
    let existingData: ExistingDataProps = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, 'Error reading data from file.');
      }
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(existingData, entryKey)) {
      res
        .status(404)
        .send({ message: `Entry not found for specified date (${entryKey})` });
      return;
    }

    delete existingData[entryKey];

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');
    res.status(204).send();
  } catch (err) {
    handleError(err, res, 'Error while deleting routine list.');
  }
};

export {
  getRoutineList,
  getRoutineByDate,
  createRoutineList,
  updateRoutineList,
  destroyRoutineList,
};
