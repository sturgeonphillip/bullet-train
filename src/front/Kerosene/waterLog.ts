// waterLog
import { isoDateKey } from '../../utils/dateKey';
import { v4 as uuid } from 'uuid';

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

export function createWaterMetricFromGauge(gauge: {
  timestamp: number;
  ounces: number;
}) {
  return {
    gauge: gauge,
    timestamp: gauge.timestamp,
    ounces: gauge.ounces,
    bladders: 0, // default
    bottles: [], // default
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

export function createWaterLogWithPartialMetrics(
  props: Partial<WaterLogProps>
) {
  const logDate = props.date ?? isoDateKey();
  const metrics: WaterMetricProps[] = props.metrics ?? [];

  if (props.metrics === undefined) {
    const bottle = createBottle();
    const metric = createWaterMetric([bottle]);
    metrics.push(metric);
  }

  return {
    date: logDate as string,
    metrics,
  };
}
