import { v4 as uuid } from 'uuid'
import { RoutineProps, EntryProps } from '../../../../types/app'

export function createRoutine(name: string): RoutineProps {
  return {
    id: uuid(),
    name: name || '[EMPTY]',
    complete: false,
    timestamp: 0,
  }
}

export function createEntry(tasks: string[] = [], date?: string): EntryProps {
  const routines = tasks.map(createRoutine)
  return {
    id: uuid(),
    date: date || isoDateKey(),
    routines,
  }
}
