import { Dispatch, SetStateAction } from 'react'
import { WizardStateEnum } from './enums'

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

export interface EntryShapeProps {
  inputDate: string
  entry: EntryProps | null
  setEntry: Dispatch<SetStateAction<EntryProps | null>>
  wizard: WizardStateEnum
}

export interface OptionsShapeProps {
  inputDate: string
  candidates: AdjacentListsResultProps
  wizard: WizardStateEnum
  setWizard: Dispatch<SetStateAction<WizardStateEnum>>
  onCreateEntry: (routines: string[]) => void
}

export interface MissingShapeProps {
  inputDate: string
  handler: (verdict: boolean) => void
  wizard: WizardStateEnum
}

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

/** Entry types */
export interface EntryProps {
  id: string
  date: string
  hydration?: HydrationProps
  notes?: string | NoteProps
  routines: RoutineProps[]
}

// rename from EntriesObjectProps
export interface EntriesArchiveProps {
  [date: string]: EntryProps
}

/** Entry properties (Hydration, Note, Routine) */
export interface HydrationProps {
  goal?: number
  totalOz: number
  // TODO: why add?
  // updated?: number
}

// TODO: how will I integrate this (if at all?)
export interface NoteProps {
  content: string
  format?: 'plain' | 'markdown'
  updated?: number
}

// one routine item from the array of routines on an entry
export interface RoutineProps {
  id: string
  name: string
  complete: boolean
  timestamp: number
  onComplete?: (id: string) => void
}

// the evergreen list of routines to initialize a new day's entry
export interface RoutineListProps {
  routineNames: string[]
  dateIntroduced?: string
  label?: string
  notes?: string
}

// the evolution of routine lists
export interface RoutineListHistoryProps {
  [date: string]: RoutineListProps
}
