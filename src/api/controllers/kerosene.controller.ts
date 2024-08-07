import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

import { handleError } from '../../utils/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, './../../../db/kerosene.json');

const getWaterData = async (): Promise<{
  [key: string]: WaterLogProps;
} | null> => {
  try {
    const data = await fs.readFile(filePath, 'utf8');

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const getFullWaterLog = async (_req: Request, res: Response) => {
  try {
    const data = await getWaterData();

    if (!data) {
      throw new Error('Unable to retrieve water log. No data found.');
    }

    res.status(200).send(data);
  } catch (err) {
    handleError(err, res, 'No water log data found.');
    // return null;
  }
};

const getLog = async (req: Request, res: Response) => {
  try {
    const byDate = req.params.date;
    const data = await fs.readFile(filePath, 'utf8');
    const waterLog = await JSON.parse(data);

    const water = waterLog[byDate];

    if (water) {
      res.status(200).json(water);
    } else {
      res
        .status(404)
        .send({ message: 'No water log found for the specified date.' });
    }
  } catch (err) {
    handleError(err, res, 'Error reading water log from database.');
    // return null;
  }
};

const getLogByBottle = async (req: Request, res: Response) => {
  try {
    const { date, id } = req.params;
    const logData = await getWaterData();

    console.log('BOTTLE ID', id);
    if (!logData) {
      res
        .status(404)
        .send({ message: 'No water log found for the specified date.' });
      return;
    }

    const logByDate = logData[date];

    // assume logData contains an array of bottles or objects that can be filtered by id
    // const bottleInfo = logByDate?.bottles?.find((bottle) => bottle.id === id);
    // console.log(bottleInfo);

    if (!logByDate) {
      res
        .status(404)
        .send({ message: 'No bottle found with the specified id.' });
      return;
    }

    res.status(200).json(logByDate);
  } catch (err) {
    handleError(err, res, 'Error retrieving bottle information.');
  }
};

const createLog = async (req: Request, res: Response) => {
  try {
    const logDate = req.params.date;
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

    if (Object.prototype.hasOwnProperty.call(existingData, logDate)) {
      throw new Error(
        'The specific date for which you are trying to create a log already has associated data. Instead of creating a new log entry, update or delete the existing log.'
      );
    }

    const waterLog = req.body;

    const allWaterRecords = {
      ...existingData,
      [logDate]: waterLog,
    };

    // TODO: verify entries are sorted

    await fs.writeFile(filePath, JSON.stringify(allWaterRecords), 'utf8');

    res.status(201).json(waterLog);
  } catch (err) {
    handleError(err, res, 'Error while writing new water log.');
  }
};

const updateLog = async (req: Request, res: Response) => {
  try {
    const logDate = req.params.date;
    let existingData: { [key: string]: WaterLogProps } = {};

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

    let log: WaterLogProps = existingData[logDate];
    log = { ...req.body };
    existingData[logDate] = log;

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8');

    res.status(204).send({ message: 'Update successful.' });
  } catch (err) {
    handleError(err, res, 'Error updating water log.');
  }
};

const destroyLog = async (req: Request, res: Response) => {
  try {
    const logDate = req.params.date;
    let existingData: { [key: string]: WaterLogProps } = {};

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

    if (!Object.prototype.hasOwnProperty.call(existingData, logDate)) {
      res
        .status(404)
        .send({ message: `Log not found for specified date (${logDate}).` });
    }
  } catch (err) {
    handleError(err, res, 'Error while deleting the log.');
  }
};

export {
  getFullWaterLog,
  getLog,
  getLogByBottle,
  createLog,
  updateLog,
  destroyLog,
};

// TODO: move types out of controller
interface BottleProps {
  id: string;
  ounces: number;
  color?: string;
}

interface WaterMetricsProps {
  update: number;
  timestamp: number;
  ounces: number;
  bottleCount: number;
  bottles: BottleProps[];
}

interface WaterLogProps {
  date: string;
  metrics: WaterMetricsProps[];
}
