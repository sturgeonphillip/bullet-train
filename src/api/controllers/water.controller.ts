import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

import { handleError } from '../../utils/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../../db/water.json');

const getWaterStats = async (req: Request, res: Response) => {
  try {
    const byDate = req.params.date;
    const data = await fs.readFile(filePath, 'utf8');
    const waterHistory = await JSON.parse(data);

    const water = waterHistory[byDate];
    if (water) {
      res.status(200).json(water);
    } else {
      res
        .status(404)
        .send({ message: 'Water history not found for specified date.' });
    }
  } catch (err) {
    handleError(err, res, 'Error reading water stats from database.');
    return;
  }
};

const createWaterStats = async (req: Request, res: Response) => {
  try {
    const byDate = req.params.date;
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
        return;
      }
    }

    const waterStats = req.body;

    const allWaterStats = {
      ...existingData,
      [byDate]: waterStats,
    };

    await fs.writeFile(filePath, JSON.stringify(allWaterStats), 'utf8');

    res.status(201).json(waterStats);
  } catch (err) {
    handleError(err, res, 'Error while writing new water stats.');
    return;
  }
};

const updateWaterStats = async (req: Request, res: Response) => {
  try {
    const dateKey = req.params.date;
    const updatedWaterStats = req.body;

    console.log('UPDATED WATER STATS', updatedWaterStats);

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

    let waterStats = existingData[dateKey];

    waterStats = { ...req.body };
    existingData[dateKey] = waterStats;

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');

    res.status(204).send();
  } catch (err) {
    handleError(err, res, 'Error updating water stats.');
    return;
  }
};

const destroyWaterStats = async (req: Request, res: Response) => {
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
        return;
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

export { getWaterStats, createWaterStats, updateWaterStats, destroyWaterStats };
