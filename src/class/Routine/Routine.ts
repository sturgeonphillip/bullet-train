import { createRoutine, RoutineProps } from './createRoutine';

export default class Routine {
  date: number;
  routines: RoutineProps[];

  constructor(date: number, routines: string[]) {
    this.date = date;
    this.routines = routines.map((r) => createRoutine(r));
  }

  public getDate() {
    return this.date;
  }

  public getRoutines() {
    return this.routines;
  }

  public getByName() {
    return this.routines.map((r) => r.name);
  }

  public getById() {
    return this.routines.map((r) => r.id);
  }

  public getComplete() {
    const complete = this.routines.filter((r) => r.complete === true);
    if (complete.length === 0) {
      return ['nothing done!'];
    }
    return complete;
  }

  public setComplete(id: string) {
    this.routines = this.routines.map((routine) => {
      if (routine.id === id) {
        return {
          ...routine,
          complete: true,
          timestamp: Date.now(),
        };
      }
      return routine;
    });
  }

  public setIncomplete(id: string) {
    this.routines = this.routines.map((routine) => {
      if (routine.id === id) {
        return {
          ...routine,
          complete: false,
          timestamp: 0,
        };
      }
      return routine;
    });
  }

  public setAllComplete() {
    this.routines = this.routines.map((routine) => ({
      ...routine,
      complete: true,
      timestamp: Date.now(),
    }));
  }

  public setAllIncomplete() {
    this.routines = this.routines.map((routine) => ({
      ...routine,
      complete: false,
      timestamp: 0,
    }));
  }

  public addRoutine(name: string) {
    const newRoutine = createRoutine(name);
    this.routines = [...this.routines, newRoutine];
  }

  public removeRoutine(id: string) {
    this.routines = this.routines.filter((r) => r.id !== id);
  }

  public createNewDay() {
    this.date = Date.now();

    this.routines = this.routines.map((routine) => createRoutine(routine.name));
  }

  public sortRoutineProperties(): RoutineProps[] {
    return this.routines.map((routine) => ({
      name: routine.name,
      complete: routine.complete,
      timestamp: routine.timestamp,
      id: routine.id,
    }));
  }

  // end
}

/**
 * // TODO:
 *
 * getTimeComplete
 *
 * editPastDay
 * edit a single routine on a past day
 * edit a whole past day
 *
 * add routine to begin on specific future date
 *
 */
