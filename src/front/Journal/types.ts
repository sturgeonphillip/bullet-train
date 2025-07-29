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
  wizard: WizardStateEnum
}

export interface DisplayMissingProps {
  inputDate: string
  handler: (verdict: boolean) => void
  wizard: WizardStateEnum
}

export interface DisplayListOptionProps {
  inputDate: string
  candidates: AdjacentListsResultProps
  wizard: WizardStateEnum
  setWizard: React.Dispatch<React.SetStateAction<WizardStateEnum>>
  onCreateEntry: (tasks: string[]) => void
}

export enum WizardStateEnum {
  SHOW_ENTRY = 'SHOW_ENTRY',
  MISSING_ENTRY = 'MISSING_ENTRY',
  LIST_OPTIONS = 'LIST_OPTIONS',
}
