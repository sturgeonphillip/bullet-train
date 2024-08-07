import { v4 as uuid } from 'uuid';
import { isoDateKey } from '../../utils/dateKey';
export interface BottleProps {
  dateKey: string;
  id: string;
  color: string;
  ounces: number[];
  setOunces?: (oz: number[]) => void;
}

export function createBottle(color: string, date?: string): BottleProps {
  return {
    id: uuid(),
    dateKey: date ? date : isoDateKey(),
    color,
    ounces: [0],
  };
}
