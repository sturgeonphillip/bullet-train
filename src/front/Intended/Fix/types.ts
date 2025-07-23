// import { Dispatch, SetStateAction } from 'react';

// export interface EntryProps {
//   id: string;
//   date: string;
//   routines: RoutineProps[];
// }

// export interface RoutineProps {
//   id: string;
//   name: string;
//   complete: boolean;
//   timestamp: number;
//   onComplete?: (id: string) => void;
// }

// export type ListProps = {
//   [entryDate: string]: string[];
// };

// export type RoutineListProps = string[];

// export type ListOptionProps = [string, string[]];

// export interface DisplayEntryProps {
//   inputDate: string;
//   entry: EntryProps | null;
//   setEntry: Dispatch<SetStateAction<EntryProps | null>>;
//   wizard: number;
// }

// export interface DisplayMissingProps {
//   inputDate: string;
//   // handleTrue: (verdict: boolean) => void;
//   // handleFalse: (verdict: boolean) => void;
//   handler: (verdict: boolean) => void;
//   wizard: number;
// }

// export interface DisplayListOptionProps {
//   inputDate: string;
//   candidates: ListOptionProps[];
//   createNewEntry?: (list: string[]) => void;
//   wizard: number;
//   setWizard: React.Dispatch<React.SetStateAction<number>>;
// }
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

export interface AdjacentListsResult {
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
  candidates: AdjacentListsResult
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
