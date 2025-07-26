export interface EntryProps {
  id: string
  date: string
  routines: RoutineProps[]
}

export interface RoutineProps {
  id: string
  name: string
  complete: boolean
  timestamp: number
  onComplete?: (id: string) => void
}

export interface ListProps {
  [key: string]: string[]
}

export interface AdjacentListsResultProps {
  before: {
    date: string
    practices: string[] // ***
  }
  after: {
    date: string
    practices: string[] // ***
  }
}

export interface DisplayEntryProps {
  inputDate: string
  entry: EntryProps | null
  setEntry: React.Dispatch<React.SetStateAction<EntryProps | null>>
  wizard: WizardState
}

export interface DisplayMissingProps {
  inputDate: string
  handler: (verdict: boolean) => void
  wizard: WizardState
}

export interface DisplayListOptionProps {
  inputDate: string
  candidates: AdjacentListsResultProps
  wizard: WizardState
  setWizard: React.Dispatch<React.SetStateAction<WizardState>>
  onCreateEntry: (tasks: string[]) => void
}

export enum WizardState {
  SHOW_ENTRY = 'SHOW_ENTRY',
  MISSING_ENTRY = 'MISSING_ENTRY',
  LIST_OPTIONS = 'LIST_OPTIONS',
}

export class ApiError extends Error {
  status?: number

  constructor({ message, status }: { message: string; status?: number }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
