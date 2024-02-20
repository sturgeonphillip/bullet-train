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
    this.habits = this.habits.map((habit) => ({
      ...habit,
      complete: false,
    }));
  }

  public resetHabits() {
    this.habits = this.habits.map((habit) => ({
      ...habit,
      complete: false,
    }));
  }
}

export interface HabitProps {
  habits: Habit[];
  date: number;
}
