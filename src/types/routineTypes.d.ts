export interface RoutineProps {
  id: string
  name: string
  isComplete: boolean
}

export interface RoutineListProps {
  date: string
  routines: RoutineProps[]
  label?: string
  notes?: string
}

export interface RoutineListArchiveProps {
  date: string
  routines: string[]
}

export interface EntryProps {
  timestamp: string
  completedRoutineIds: string[]
}
