import { Dispatch, SetStateAction } from 'react'

/** UI-bound types (specific to frontend) */
export interface AdjacentListsResultProps {
  before: {
    date: string
    routines: string[]
  }
  after: {
    date: string
    routines: string[]
  }
}

export interface DisplayEntryProps {
  inputDate: string
  entry: EntryProps | null
  setEntry: Dispatch<SetStateAction<EntryProps | null>>
}

export interface DisplayListOptionProps {
  inputDate: string
  candidates: AdjacentListsResultProps
  wizard: WizardStateEnum
  setWizard: Dispatch<SetStateAction<WizardStateEnum>>
  onCreateEntry: (routines: string[]) => void
}

export interface DisplayMissingProps {
  inputDate: string
  handler: (verdict: boolean) => void
  wizard: WizardStateEnum
}

export enum WizardStateEnum {
  SHOW_ENTRY = 'SHOW_ENTRY',
  MISSING_ENTRY = 'MISSING_ENTRY',
  LIST_OPTIONS = 'LIST_OPTIONS',
}

/** Hydration and Notes (other aspects of an entry) types */
export interface NoteProps {
  content: string
  format?: 'plain' | 'markdown'
  updated?: number
}

export interface HydrationProps {
  goal?: number
  totalOz: number
  updated?: number
}

/** Entry types */
export interface EntryProps {
  id: string
  date: string
  hydration?: HydrationProps
  notes?: NoteProps
  routines: RoutineProps[]
}

// rename from EntriesObjectProps
export interface EntriesArchiveProps {
  [date: string]: EntryProps
}

/** Routine Props */
// one routine item from the array of routines on an entry
export interface RoutineProps {
  id: string
  name: string
  complete: boolean
  timestamp: number
  onComplete?: (id: string) => void
}

// the evergreen list of routines used to initialize a new day's entry
export interface RoutineListProps {
  // references to routine by name
  routineNames: string[]
  // I don't like "created at", but need something to indicate its start
  dateIntroduced?: string
  label?: string
  notes?: string
}

// the evolution of routine lists
export interface RoutineListHistoryProps {
  [date: string]: RoutineListProps
}

// export interface RoutineListArchiveProps {} -> I don't think I need this

/** Errand types */
export interface ErrandProps {
  id: string
  edit?: boolean
  name: string
  complete: boolean
  timeAssigned?: number
  timeExecuted?: number
  showDelete?: boolean
  onDelete?: (id: string) => void
  onComplete?: (id: string) => void
}
