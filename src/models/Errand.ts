import { v4 as uuid4 } from 'uuid';

export interface Errand {
  id: string;
  name: string;
  complete: boolean;
  dateAdded: number;
  dateCompleted?: number | '';
}

export function createErrand(name: string): Errand {
  return {
    id: uuid4(),
    name,
    complete: false,
    dateAdded: Date.now(),
    dateCompleted: '',
  };
}
