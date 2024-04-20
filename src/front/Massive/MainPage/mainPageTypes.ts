import { Dispatch, SetStateAction } from 'react';
export interface ListProps {
  [dateKey: string]: string[];
}

export interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}

export interface EntryProps {
  id: string;
  date: string;
  routines: RoutineProps[];
}

export interface DisplayEntryProps {
  wizard: number;
  entry: EntryProps;
  setEntry: Dispatch<SetStateAction<EntryProps | null>>;
  entryDate: string;
}

export interface DisplayMissingProps {
  inputDate: string;
  wizard: number;
  setWizard: Dispatch<SetStateAction<number>>;
  //   handler: (verdict: boolean) => void;
}

export interface DisplayListProps {
  before: string[][];
  after: string[][];
  inputDate: string;
  wizard: number;
  setWizard: React.Dispatch<React.SetStateAction<number>>;
  createNewEntry: (list: string[]) => void;
}
