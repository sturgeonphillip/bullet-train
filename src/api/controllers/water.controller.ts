import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { NextFunction, Request, Response } from 'express';

import { handleError } from '../../utils/errorHandler';
import { sortRecords } from '../../utils/sortEntries';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../../db/water.json');

const getWaterRecords = async (_req: Request, res: Response) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    res.status(200).send(data);
  } catch (err) {
    handleError(err, res, 'Error reading water levels from database.');
  }
};

const getWaterRecordByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const byDate = req.params.date;
    const data = await fs.readFile(filePath, 'utf8');
    const records = await JSON.parse(data);

    const water = records[byDate];

    if (water) {
      res.status(200).json(water);
    } else if (!water) {
      return next();
    }
  } catch (err) {
    handleError(err, res, 'Error reading water data from database.');
  }
};

const createWaterRecord = async (req: Request, res: Response) => {
  try {
    const recordDate = req.params.date;
    let existingData = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');

      existingData = await JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(
          err,
          res,
          'Error reading existing water history from file.'
        );
      }
    }

    const waterRecord = req.body;

    const allWaterRecords = {
      ...existingData,
      [recordDate]: waterRecord,
    };

    const sorted = sortRecords(allWaterRecords);

    console.log('sorted water records: ', sorted);
    await fs.writeFile(filePath, JSON.stringify(sorted), 'utf8');

    res.status(201).json(sorted);
  } catch (err) {
    handleError(err, res, 'Error while writing new water stats.');
    return;
  }
};

const updateWaterRecords = async (req: Request, res: Response) => {
  try {
    const dateKey = req.params.date;
    const updatedWaterRecords = req.body;

    console.log('UPDATED WATER STATS', updatedWaterRecords);

    let existingData: { [key: string]: number } = {};

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

    let waterRecord = existingData[dateKey];

    waterRecord = { ...req.body };
    existingData[dateKey] = waterRecord;

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');

    res.status(204).send();
  } catch (err) {
    handleError(err, res, 'Error updating water stats.');
    return;
  }
};

const destroyWaterRecord = async (req: Request, res: Response) => {
  try {
    const dateKey = req.params.date;
    let existingData: { [key: string]: number } = {};

    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(content);
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {};
      } else {
        handleError(err, res, `Error reading water stats.`);
      }
    }

    if (!Object.prototype.hasOwnProperty.call(existingData, dateKey)) {
      res
        .status(404)
        .send({ message: `Entry not found for specified date (${dateKey}).` });
      return;
    }

    delete existingData[dateKey];

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');
    res.status(204).send();
  } catch (err) {
    handleError(err, res, 'Error while deleting water stats.');
  }
};

export {
  getWaterRecords,
  getWaterRecordByDate,
  createWaterRecord,
  updateWaterRecords,
  destroyWaterRecord,
};
