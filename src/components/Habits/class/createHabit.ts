import { v4 as uuid } from 'uuid';

export interface HabitProps {
  id: string;
  name: string;
  complete: boolean;
  onComplete?: (id: string) => void;
}

export function createHabit(name: string): HabitProps {
  name = name ?? '[EMPTY]';
  return {
    id: uuid(),
    name,
    complete: false,
  };
}
