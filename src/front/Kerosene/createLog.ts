import { v4 as uuid } from 'uuid';
import { isoDateKey } from '../../utils/dateKey';

// Create a bottle with default properties
export function createBottle(): BottleProps {
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
    const empty = createBottle();
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

// Create a water log with a date argument
// TODO: implement a return output with default properties
export function createNewDayWaterLog(date: Partial<WaterLogProps>) {
  console.log('DATE:', date, 'type:', typeof date);
  const logDate = date.date ?? isoDateKey();
  console.log('logDATE:', logDate, 'type:', typeof logDate);

  const bottle = createBottle();
  const metric = createWaterMetric([bottle]);

  return {
    date: logDate as string,
    metrics: [metric],
  };
}

// Create a water log with default properties
export function createWaterLog(date: Partial<WaterLogProps>) {
  const logDate = date.date ?? isoDateKey();
  const bottle = createBottle();
  const metric = createWaterMetric([bottle]);

  return {
    date: logDate as string,
    metrics: [metric],
  };
}

// Create a non-consecutive water log with default properties
export function createNonconsecutiveWaterLog({
  date,
  metrics = [],
}: Partial<WaterLogProps>) {
  if (!date) {
    date = isoDateKey();
  }

  return {
    date,
    metrics,
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

export function createWaterLogWithPartial(date: Partial<WaterLogProps>) {
  // console.log('DATE:', date, 'type:', typeof date);
  const logDate = date.date ?? isoDateKey();
  // console.log('logDATE:', logDate, 'type:', typeof logDate);

  const bottle = createBottle();
  const metric = createWaterMetric([bottle]);

  return {
    date: logDate as string,
    metrics: [metric],
  };
}

// adjust parameters to be optional

// handle logic to merge provided values with defaults

export function createWaterLogWithPartialProvision({
  date = isoDateKey(),
  metrics = [],
}: Partial<WaterLogProps> = {}) {
  // if metrics are provided, process to ensure they meet our expected structure, using default values where there are none
  const processedMetrics = metrics.map((metric) => ({
    ...metric,
    gauge: metric.gauge || 0,
    timestamp: metric.timestamp || Date.now(),
    ounces: metric.ounces || 0,
    bladders: metric.bladders || 0,
    bottles: metric.bottles || [createBottle()],
  }));

  /** seems wrong at first glance */
  // create new bottle if none specified & add to metrics
  const bottleA = createBottle();
  const bottleB = createBottle();

  processedMetrics.push({
    gauge: 0,
    timestamp: Date.now(),
    ounces: 0,
    bladders: 1,
    bottles: [bottleA, bottleB],
  });

  return {
    date,
    metrics: processedMetrics,
  };
}
