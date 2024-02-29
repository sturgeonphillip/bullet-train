import { createHabit, HabitProps } from './createHabit';

export default class Habits {
  private date: number;
  private habits: HabitProps[];

  constructor(date: number, habits: string[]) {
    this.date = date;
    this.habits = habits.map((h) => createHabit(h));
  }

  public addHabit(name: string) {
    const newHabit = createHabit(name);
    this.habits = [...this.habits, newHabit];
  }

  public getHabits(): HabitProps[] {
    return this.habits;
  }

  public getHabitsByName() {
    return this.habits.map((h) => h.name);
  }

  public getDate(): number {
    return this.date;
  }

  public markAllComplete(): HabitProps[] {
    this.habits.forEach((h) => (h.complete = true));
    return this.habits;
  }

  public setDate(date: number) {
    this.date = date;
    this.habits = this.habits.map((habit) => ({
      ...habit,
      complete: false,
    }));
  }

  // TODO: fix to use for correcting an item marked complete prematurely
  // modify to use id - not index
  // public resetHabitDate(id: number) {
  //   if (this.habits[id].complete) {
  //     this.habits[id] = 0;
  //   }
  // }

  public resetHabits() {
    this.habits = this.habits.map((habit) => ({
      ...habit,
      complete: false,
    }));
  }

  public resetDateHabits() {
    this.date = Date.now();

    this.habits = this.habits.map((habit) => ({
      ...habit,
      complete: false,
    }));

    return { date: this.date, habits: this.habits };
  }

  public sortHabitsProperties(): HabitProps[] {
    console.log(
      this.habits.map((habit) => ({
        name: habit.name,
        complete: habit.complete,
        id: habit.id,
      }))
    );
    return this.habits.map((habit) => ({
      name: habit.name,
      complete: habit.complete,
      id: habit.id,
    }));
  }

  public toJSON(): Record<string, unknown> {
    return {
      date: this.date,
      habits: this.habits,
    };
  }
}
