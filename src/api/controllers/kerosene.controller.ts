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

const getWaterLog = async (_req: Request, res: Response) => {
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

// entire log for specified date
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

// single gauge on selected date
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

const createLogByDateRewrite = async (req: Request, res: Response) => {
  try {
    const date = req.params.date;
    const { ounces, capacity } = req.body;

    if (!date || !ounces || !capacity) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // const waterData = await getWaterData();
    const waterLog = await getWaterData();

    // if (!waterData) {
    //   throw new Error('Unable to retrieve water data.');
    // }
    if (!waterLog) {
      throw new Error('Unable to retrieve water data.');
    }

    // if (!waterData[date]) {
    //   waterData[date] = createWaterLog({ date });
    // }
    if (!waterLog[date]) {
      waterLog[date] = createNonconsecutiveWaterLog({ date });
    }

    const firstBottle = createBottle();
    firstBottle.ounces = [ounces];
    firstBottle.capacity = capacity;

    // const metric = waterLog[date].metrics[0];
    const metric = createWaterMetric([firstBottle]);

    waterLog[date].metrics.push(metric);

    // metric.gauge++;
    // metric.bottles.push(firstBottle);
    // metric.ounces = metric.bottles.reduce(
    //   (acc, bottle) => acc + bottle.ounces[0],
    //   0
    // );
    // metric.bladders = metric.bottles.length;

    // await fs.writeFile(filePath, JSON.stringify(waterData, null, 2));
    await fs.writeFile(filePath, JSON.stringify(waterLog, null, 2));

    res.status(201).json(firstBottle);
  } catch (err) {
    handleError(err, res, 'Error creating new log entry.');
  }
};

const createLogByDate = async (req: Request, res: Response) => {
  try {
    const date = req.params.date;
    const { ounces, capacity } = req.body;

    if (!date || !ounces || !capacity) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // let's change the use of the variable "metrics" here because metrics is one of the primary properties on each data entry.
    const metrics = await getWaterData();

    if (!metrics) {
      throw new Error('Unable to retrieve metrics data.');
    }

    if (!metrics[date]) {
      metrics[date] = { gauge: 0, bottles: [] };
    }

    // i already have a function to create a new bottle. see below.
    const newBottle = {
      id: uuid(),
      ounces,
      capacity,
      complete: false,
    };

    // despite the use of the word metrics, i still like this implementation because it's highly readable
    metrics[date].gauge++;
    metrics[date].bottles.push(newBottle);

    await fs.writeFile(filePath, JSON.stringify(metrics, null, 2));

    res.status(201).json(newBottle);
  } catch (err) {
    handleError(err, res, 'Error creating new log entry.');
  }
};

const createLogBottle = async (req: Request, res: Response) => {
  try {
    const date = req.params.date;
    const { ounces, capacity } = req.body;
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
  getWaterLog,
  getLogByDate,
  getGaugeByDate,
  createLogByDate,
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
  gauge: number;
  timestamp: number;
  ounces: number;
  bottleCount: number;
  bottles: BottleProps[];
}

interface WaterLogProps {
  date: string;
  metrics: WaterMetricsProps[];
}

/**
 * 
 * That sounds like a great approach!

By updating the client-side state immediately and then debouncing the state update to the server, you can provide a responsive and interactive experience for the user. This approach is known as "optimistic updating" or "client-side rendering with server-side validation".

Here's a high-level overview of how you can implement this:

Client-side state update: When the user interacts with the slider, update the client-side state immediately. This will provide a fast and responsive experience for the user.
Debouncer: Implement a debouncer that delays the state update to the server by a certain amount of time (e.g., 500ms). This will allow the user to make multiple changes to the slider without sending multiple requests to the server.
Server-side validation and update: When the debouncer triggers, send the updated state to the server. The server will validate the data and update the water log accordingly.
By using a debouncer, you can reduce the number of requests sent to the server, which can improve performance and reduce latency. Additionally, by updating the client-side state immediately, you can provide a responsive experience for the user.

Here's some sample code to illustrate this approach:

import { useState } from 'react';
import { debounce } from 'lodash';

const WaterSlider = () => {
  const [waterAmount, setWaterAmount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSliderChange = (newAmount: number) => {
    setWaterAmount(newAmount);
  };

  const debouncedUpdateServer = debounce(async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      // Send updated state to server
      const response = await fetch('/update-water-log', {
        method: 'POST',
        body: JSON.stringify({ waterAmount }),
        headers: { 'Content-Type': 'application/json' },
      });
      // Handle server response
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }, 500);

  return (
    <div>
      <Slider
        value={waterAmount}
        onChange={handleSliderChange}
        min={0}
        max={100}
      />
      {isUpdating ? <p>Updating...</p> : null}
    </div>
  );
};
 */
