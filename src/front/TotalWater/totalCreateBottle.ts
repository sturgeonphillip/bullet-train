import { v4 as uuid } from 'uuid';
import { isoDateKey } from '../../utils/dateKey';
import { BottleProps } from './totalWaterProps';

export function createTotalBottle(color: string, date?: string): BottleProps {
  return {
    id: uuid(),
    dateKey: date ? date : isoDateKey(),
    color,
    ounces: 0,
  };
}
