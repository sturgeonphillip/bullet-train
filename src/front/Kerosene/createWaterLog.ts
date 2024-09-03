import { isoDateKey } from '../../utils/dateKey';
import { v4 as uuid } from 'uuid';

// Create a bottle with default properties
export function createWaterBottle(): BottleProps {
  return {
    id: uuid(),
    ounces: [0],
    capacity: 32,
    complete: false,
    // label
  };
}

// Create a water metric with default properties
export function createWaterMetrics(
  bottles: BottleProps[] = []
): WaterMetricsProps {
  if (bottles.length <= 0) {
    const empty = createWaterBottle();
    bottles.push(empty);
  }

  return {
    gauge: 0,
    timestamp: Date.now(),
    ounces: bottles.reduce((acc, crv) => acc + crv.ounces[0], 0),
    bladders: bottles.length,
    bottles,
  };
}

// create a water log base with drefauult properties
export function createWaterLogBase(logDate: string): WaterLogProps {
  return {
    // TODO: consider whether or not logDate should remain a property on WaterLogProps, and whether it should be "date" or "logDate"
    logDate,
    metrics: [
      createWaterMetrics([
        createWaterBottle(),
        createWaterBottle(),
        createWaterBottle(),
        createWaterBottle(),
      ]),
    ],
  };
}

// create a new log for a consecutive day
export function createWaterLog(): WaterLogProps {
  const today = isoDateKey();
  return createWaterLogBase(today);
}

// create a new log for a nonconsecutive day
export function createNonconsecutiveWaterLog(logDate: string): WaterLogProps {
  return createWaterLogBase(logDate);
}

// create a log entry with partial metrics
export function createWaterLogWithPartialMetrics({
  logDate = isoDateKey(),
  metrics = [],
}: Partial<WaterLogProps> = {}): WaterLogProps {
  const processedMetrics = metrics.map((metric) => {
    // ensure each metric has at least one bottle
    if (!metric.bottles || metric.bottles.length === 0) {
      metric.bottles = [createWaterBottle()];
    }

    return {
      ...metric,
      gauge: metric.gauge || 0,
      timestamp: metric.timestamp || Date.now(),
      ounces: metric.ounces || 0,
      bladders: metric.bottles.length,
      bottles: metric.bottles || [createWaterBottle()],
    };
  });

  // if no metrics are provided, create a default metric with a single bottle
  if (processedMetrics.length === 0) {
    processedMetrics.push({
      gauge: 0,
      timestamp: Date.now(),
      ounces: 0,
      bladders: 1,
      bottles: [createWaterBottle()],
    });
  }

  return {
    logDate,
    metrics: processedMetrics,
  };
}

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
  // TODO: consider whether or not logDate should remain a property on WaterLogProps, and whether it should be "date" or "logDate"
  logDate: string;
  metrics: WaterMetricsProps[];
}

/** logDate validation */
// TODO: apply one of the following sanitization checks to createwhere necessary.

// type guard to validate the `logDate` parameter
export function isValidLogDate(logDate: string): logDate is string {
  const logDatePattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
  return logDatePattern.test(logDate);
}

// define branded type
type LogDate = string & { __brand: 'LogDate' };

// returns a type predicate, asserts the parameter is a properly formatted string by testing it against the regex
export function createLogDate(logDate: string): LogDate {
  const logDatePattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

  if (!logDatePattern.test(logDate)) {
    throw new Error(`Invalid logDate format: ${logDate}`);
  }
  return logDate as LogDate;
}
