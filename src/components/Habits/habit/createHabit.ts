type Habit = {
  id: string;
  name: string;
  complete: boolean;
  onComplete?: (id: string) => void;
};

export interface HabitProps {
  id: string;
  habits: Habit[];
  date?: number;
}

function createHabit(id: string, name: string): Habit {
  name = name ?? '[EMPTY]';
  return {
    id,
    name,
    complete: false,
  };
}

export function addHabit(name: string, daily: HabitProps) {
  const newHabit = createHabit(name);

  return (daily.habits = [...habits, newHabit]);
}

/** *** DailyHabits */
export class DailyHabits {
  private habits: Habit[];
  private date: number;

  constructor(habits: Habit[], date: number) {
    this.habits = habits;
    this.date = date;
  }

  public addHabit(name: string) {
    const newHabit = createHabit(name);
    this.habit = [...this.habits, newHabit];
  }

  public getHabits(): Habit[] {
    return this.habits;
  }

  public getDate(): number {
    return this.date;
  }

  public setDate(date: number) {
    this.date = date;
    this.habits = this.habits.map((habit) => ({ ...habit, complete: false }));
  }

  public resetHabits() {
    this.habits = this.habits.map((habit) => ({ ...habit, complete: false }));
  }
}

export interface HabitProps {
  habits: Habit[];
  date: number;
}
