import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';

import { handleError } from '../../utils/errorHandler';

// TODO: move these functions to a better place than front/Kerosene
import { createWaterMetrics } from '../../front/Kerosene/createWaterLog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, './../../../db/kerosene.json');

export const getWaterData = async (): Promise<{
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

// get entire water database
const getAllWaterLogRecords = async (_req: Request, res: Response) => {
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

// get log for specific date
const getLogByDate = async (req: Request, res: Response) => {
  try {
    const byDate = req.params.date;
    const data = await getWaterData();

    if (!data) {
      throw new Error(`Unable to retrieve log data.`);
    }

    const water = data[byDate];

    if (!water) {
      throw new Error(`Unable to retrieve log for date (${byDate}).`);
    }

    res.status(200).json(water);
  } catch (err) {
    handleError(err, res, 'Error reading water log from database.');
    // return null;
  }
};

// single metric gauge for date
const getGaugeByDate = async (req: Request, res: Response) => {
  try {
    const { date: byDate, gauge: byGauge } = req.params;

    const gaugeNum = parseInt(byGauge, 10);

    if (isNaN(gaugeNum) || gaugeNum < 0 || !/^\d+$/.test(byGauge)) {
      return res.status(400).json({
        message: 'Invalid gauge number. Must be a non-negative integer.',
      });
    }

    if (!byDate || !byGauge) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    const data = await getWaterData();

    if (!data) {
      throw new Error(`[1] No data. Unable to retrieve log data.`);
    }

    const water = data[byDate];

    console.log('WATER!', water);
    if (!water) {
      throw new Error(`[2] Unable to retrieve log for date (${byDate}).`);
    }

    const gaugePosition = water.metrics.find(
      (metric) => metric.gauge === gaugeNum
    );

    if (!gaugePosition) {
      throw new Error(`Gauge ${gaugeNum} not found for date ${byDate}.`);
    }

    /**
     * alternate response is to return:
     * if (!gaugePosition) {
     *   return res.status(404).json({ message: `Gauge ${gaugeNum} not found for date ${byDate}.` })
     * }
     */

    res.status(200).json(gaugePosition);
  } catch (err) {
    handleError(err, res, 'Error retrieving bottle information.');
  }
};

// create new log with no preexisting data, date argument always required
export const createWaterLogForNewDate = async (req: Request, res: Response) => {
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

/**
 * create log with preexisting/partial data
 * create new metric(?) --> which would just be updating an existing log
 */
// TODO: refactor - sort out and combine these three commented functions
// export const createOrUpdateLog = async (req: Request, res: Response) => {
//   try {
//     const logDate = req.params.date;
//     const { ounces, capacity } = req.body;

//     if (!logDate || !ounces || !capacity) {
//       return res.status(400).json({ message: 'Missing required fields.' });
//     }

//     let existingData = {};

//     try {
//       const content = await fs.readFile(filePath, 'utf8');
//       existingData = JSON.parse(content);
//     } catch (err) {
//       if (err instanceof SyntaxError) {
//         existingData = {};
//       } else {
//         return handleError(
//           err,
//           res,
//           'Error reading existing content from file.'
//         );
//       }
//     }

//     if (existingData[logDate]) {
//       return res.status(409).json({
//         message:
//           'Log entry for this date already exists. Consider updating or deleting the existing log.',
//       });
//     }

//     const newLogEntry = createWaterLogWithPartialMetrics({
//       logDate,
//       metrics: [{ ounces, capacity }],
//     });

//     existingData[logDate] = newLogEntry;

//     await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf8');

//     res.status(201).json(newLogEntry);
//   } catch (err) {
//     handleError(err, res, 'Error creating or updating log entry.');
//   }
// };

// const createLogByDate = async (req: Request, res: Response) => {
//   try {
//     const logDate = req.params.date;

//     // this should be used for creating a log with partial metrics
//     const { ounces, capacity } = req.body;

//     if (!logDate || !ounces || !capacity) {
//       return res.status(400).json({ message: 'Missing required fields.' });
//     }

//     const waterData = await getWaterData();

//     if (!waterData) {
//       throw new Error('Unable to retrieve water data data.');
//     }

//     if (!waterData[logDate]) {
//       const newMetric = createWaterMetrics();
//       waterData[logDate] = {
//         logDate,
//         metrics: [newMetric],
//       };
//     }

//     await fs.writeFile(filePath, JSON.stringify(waterData, null, 2));

//     res.status(201).json(waterData);
//   } catch (err) {
//     handleError(err, res, 'Error creating new log entry.');
//   }
// };

// export const createLogBottle = async (req: Request, res: Response) => {
//   try {
//     const logDate = req.params.date;
//     let existingData = {};

//     try {
//       const content = await fs.readFile(filePath, 'utf8');

//       existingData = await JSON.parse(content);
//     } catch (err) {
//       if (err instanceof SyntaxError) {
//         existingData = {};
//       } else {
//         handleError(err, res, 'Error reading existing content from file.');
//       }
//     }

//     // TODO: add to createLogByDate
//     if (Object.prototype.hasOwnProperty.call(existingData, logDate)) {
//       throw new Error(
//         'The specific date for which you are trying to create a log already has associated data. Instead of creating a new log entry, update or delete the existing log.'
//       );
//     }

//     const waterLog = req.body;

//     const allWaterRecords = {
//       ...existingData,
//       [logDate]: waterLog,
//     };

//     // TODO: verify entries are sorted
//     await fs.writeFile(filePath, JSON.stringify(allWaterRecords), 'utf8');

//     res.status(201).json(waterLog);
//   } catch (err) {
//     handleError(err, res, 'Error while writing new water log.');
//   }
// };

const updateWaterLog = async (req: Request, res: Response) => {
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

const destroyWaterLog = async (req: Request, res: Response) => {
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
  getAllWaterLogRecords,
  getLogByDate,
  getGaugeByDate,
  createLogByDate,
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
