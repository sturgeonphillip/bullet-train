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

// Create a water log with default properties
export function createWaterLog({ date }: Partial<WaterLogProps>) {
  if (!date) {
    date = isoDateKey();
  }

  const bottle = createBottle();
  const metric = createWaterMetric([bottle]);

  return {
    date,
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

interface BottleProps {
  id: string;
  ounces: number[];
  capacity: number;
  complete: boolean;
  color?: string;
}

interface WaterMetricProps {
  gauge: number;
  timestamp: number;
  ounces: number;
  bladders: number;
  bottles: BottleProps[];
}

interface WaterLogProps {
  date: string;
  metrics: WaterMetricProps[];
}

const today = isoDateKey();

console.log(today);

const water = createWaterLog({ date: today });

console.log(water);
console.log(water.metrics[0].bottles);
