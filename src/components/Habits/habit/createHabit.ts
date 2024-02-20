export interface HabitProps {
  id: string;
  name: string;
  complete: boolean;
  onComplete?: (id: string) => void;
}

export function createHabit(id: string, name: string): HabitProps {
  name = name ?? '[EMPTY]';
  return {
    id,
    name,
    complete: false,
  };
}
