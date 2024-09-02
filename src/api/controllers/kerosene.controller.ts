import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';
import { handleError } from '../../utils/errorHandler';
import WaterDataService from '../../services/waterDataService';
import {
  createWaterLog,
  isValidLogDate,
} from '../../front/Kerosene/createWaterLog';

const waterDataService = new WaterDataService('./db/kerosene.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, './../../../db/kerosene.json');

// get entire water database
const getAllWaterLogRecords = async (_req: Request, res: Response) => {
  try {
    const data = await waterDataService.getWaterData();

    if (!data) {
      throw new Error('Unable to retrieve water log. No data found.');
    }

    res.status(200).send(data);
  } catch (err) {
    handleError(err, res, 'No water log data found.');
    // return null;
  }
};

// get log for specific date
const getWaterLogByDate = async (req: Request, res: Response) => {
  try {
    const logDate = req.params.date;

    isValidLogDate(logDate);

    const waterData = await waterDataService.getWaterData();

    if (!waterData) {
      throw new Error(`Unable to retrieve data from the database.`);
    }

    /** ERROR: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'WaterLogProps'.
  No index signature with a parameter of type 'string' was found on type 'WaterLogProps'.ts(7053) */
    const waterLog = waterData[logDate];

    console.log('WATER LOG', waterLog);
    if (!waterLog) {
      // TODO: more appropriate to say doesn't exist?
      throw new Error(`Unable to retrieve log for date ${logDate}.`);
    }

    res.status(200).json(waterLog);
  } catch (err) {
    handleError(err, res, 'Error reading water log from database.');
  }
};

// single metric gauge for date
const getGaugeFromLogByDate = async (req: Request, res: Response) => {
  try {
    const logDate = req.params.date;
    const logGauge = req.params.gauge;

    isValidLogDate(logDate);

    // validate user input
    if (!logDate || !logGauge) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    const gaugeNum = parseInt(logGauge, 10);

    if (
      isNaN(gaugeNum) ||
      gaugeNum < 0 ||
      typeof gaugeNum !== 'number' ||
      !/^\d+$/.test(String(gaugeNum))
    ) {
      return res.status(400).json({
        message:
          'Invalid gauge number. Request must be a non-negative integer.',
      });
    }

    const waterData = await waterDataService.getWaterData();

    if (!waterData) {
      throw new Error(`No data. Unable to retrieve log data.`);
    }

    const waterLog = waterData[logDate];

    console.log('WATER!', waterLog);
    if (!waterLog) {
      throw new Error(`Unable to retrieve log for date (${logDate}).`);
    }

    const gaugePosition = waterLog.metrics.find(
      (metric: WaterMetricsProps) => metric.gauge === gaugeNum
    );

    const mostRecentGauge = waterLog.metrics.length;

    if (!gaugePosition) {
      throw new Error(
        `Gauge ${gaugeNum} not found for date ${logDate}. No gauge data found for ${gaugeNum}. The latest gauge for ${logDate} is at gauge ${mostRecentGauge}.`
      );
    }

    res.status(200).json(gaugePosition);
  } catch (err) {
    handleError(err, res, 'Error retrieving gauge.');
  }
};

// create a new log, no preexisting data
// logDate argument always required
const createWaterLogForNewDate = async (req: Request, res: Response) => {
  try {
    const logDate = req.params.date;

    if (!logDate) {
      return res
        .status(400)
        .json({ message: 'Missing required paramter: date.' });
    }

    isValidLogDate(logDate);

    // let existingData = {};
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
        `The specific date for which you are trying to create a log (${logDate}) already has associated data. Instead of creating a new log entry, update or delete the existing log.`
      );
    }

    const waterLog = createWaterLog();

    const allWaterLogRecords = {
      ...existingData,
      [logDate]: waterLog,
    };

    // TODO: verify entries are sorted
    await fs.writeFile(filePath, JSON.stringify(allWaterLogRecords), 'utf8');

    res.status(201).json(waterLog);
  } catch (err) {
    handleError(err, res, 'Error while creating new water log entry.');
  }
};

// make updates to a water
const updateWaterLog = async (req: Request, res: Response) => {
  try {
    const logDate = req.params.date;
    let existingData: { [key: string]: WaterLogProps } = {};

    isValidLogDate(logDate);

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

const destroyWaterLog = async (req: Request, res: Response) => {
  try {
    const logDate = req.params.date;
    let existingData: { [key: string]: WaterLogProps } = {};

    isValidLogDate(logDate);
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
  getAllWaterLogRecords,
  getWaterLogByDate,
  getGaugeFromLogByDate,
  createWaterLogForNewDate,
  updateWaterLog,
  destroyWaterLog,
};

// TODO: move types out of controller
export interface BottleProps {
  id: string;
  ounces: number[];
  capacity: number;
  complete: boolean;
  label?: string;
}

export interface WaterMetricsProps {
  gauge: number;
  timestamp: number;
  ounces: number;
  bladders: number;
  bottles: BottleProps[];
}

export interface WaterLogProps {
  logDate: string;
  metrics: WaterMetricsProps[];
}

export interface WaterDataProps {
  [key: string]: WaterLogProps;
}
