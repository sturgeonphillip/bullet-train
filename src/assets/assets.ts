import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import {
  EntryProps,
  ErrandProps,
  HydrationProps,
  RoutineProps,
} from '../types/app'

export function createEntry(current: string[] = [], date?: string): EntryProps {
  const routines = current.map((name: string) => createRoutine(name))

  return {
    id: uuid(),
    date: date ?? dayjs().toISOString().split('T')[0],
    hydration: createHydration(),
    notes: '',
    routines,
  }
}

export function createRoutine(name: string): RoutineProps {
  name = name ?? '[EMPTY]'

  return {
    id: uuid(),
    name,
    complete: false,
    timestamp: 0,
  }
}

export function createHydration(goal?: number): HydrationProps {
  return {
    goal: goal ?? 0,
    totalOz: 0,
    // TODO: why add?

    // updated: 0,
  }
}

export function createErrand(name: string): ErrandProps {
  name = name ?? '[EMPTY]'

  return {
    id: uuid(),
    name,
    complete: false,
    timeAssigned: Date.now(),
    timeExecuted: 0,
  }
}
