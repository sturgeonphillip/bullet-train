import { v4 as uuid } from 'uuid';

export interface ErrandProps {
  id: string;
  name: string;
  complete: boolean;
  timeAssigned?: number;
  timeExecuted?: number;
  onComplete?: (id: string) => void;
}

export function createErrand(name: string): ErrandProps {
  name = name ?? '[EMPTY]';

  return {
    id: uuid(),
    name,
    complete: false,
    timeAssigned: Date.now(),
    timeExecuted: 0,
  };
}
