import { v4 as uuid } from 'uuid';

export interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}

export function createRoutine(name: string): RoutineProps {
  name = name ?? '[EMPTY]';
  return {
    id: uuid(),
    name,
    complete: false,
    timestamp: 0,
  };
}
