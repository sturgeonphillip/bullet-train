import { isoDateKey } from '../../utils/dateKey';
import { v4 as uuid } from 'uuid';

// Create a bottle with default properties
export function createWaterBottle(): BottleProps {
  return {
    id: uuid(),
    ounces: [0],
    capacity: 32,
    complete: false,
  };
}

// Create a water metric with default properties
export function createWaterMetric(
  bottles: BottleProps[] = []
): WaterMetricProps {
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
export function createWaterLogBase(date: string): WaterLogProps {
  return {
    date,
    metrics: [
      createWaterMetric([
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
export function createNonconsecutiveWaterLog(date: string): WaterLogProps {
  return createWaterLogBase(date);
}

// create a log entry with partial metrics
export function createWaterLogWithPartialMetrics({
  date = isoDateKey(),
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
    date,
    metrics: processedMetrics,
  };
}

export interface BottleProps {
  id: string;
  ounces: number[];
  capacity: number;
  complete: boolean;
  color?: string;
}

export interface WaterMetricProps {
  gauge: number;
  timestamp: number;
  ounces: number;
  bladders: number;
  bottles: BottleProps[];
}

export interface WaterLogProps {
  date: string;
  metrics: WaterMetricProps[];
}
