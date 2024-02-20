import { createHabit, HabitProps } from './createHabit';

export class DailyHabits {
  private habits: HabitProps[];
  private date: number;

  constructor(habits: HabitProps[], date: number) {
    this.habits = habits;
    this.date = date;
  }

  public addHabit(name: string) {
    const newHabit = createHabit(name);
    this.habit = [...this.habits, newHabit];
  }

  public getHabits(): HabitProps[] {
    return this.habits;
  }

  public getDate(): number {
    return this.date;
  }

  public setDate(date: number) {
    this.date = date;
    this.habits = this.habits.map((habit) => ({
      ...habit,
      complete: false,
    }));
  }

  // TODO: fix to use for item going complete -> incomplete (ie, accidentally clicked), modify to use id - not index
  public resetHabitDate(index: number) {
    if (this.habits[index].complete) {
      this.havits[index].date = 0;
    }
  }

  public resetHabits() {
    this.habits = this.habits.map((habit) => ({
      ...habit,
      complete: false,
    }));
  }
}
