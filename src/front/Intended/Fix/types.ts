import { Dispatch, SetStateAction } from 'react';

export interface EntryProps {
  id: string;
  date: string;
  routines: RoutineProps[];
}

export interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}

export type RoutineListProps = string[];

export type ListOptionProps = [string, string[]];

export type ListProps = { [entryDate: string]: string[] };
export interface DisplayEntryProps {
  inputDate: string;
  entry: EntryProps | null;
  setEntry: Dispatch<SetStateAction<EntryProps | null>>;
  wizard: number;
}

export interface DisplayMissingProps {
  inputDate: string;
  // handleTrue: (verdict: boolean) => void;
  // handleFalse: (verdict: boolean) => void;
  handler: (verdict: boolean) => void;
  wizard: number;
}

export interface DisplayListOptionProps {
  inputDate: string;
  candidates: ListOptionProps[];
  createNewEntry?: (list: string[]) => void;
  wizard: number;
  setWizard: React.Dispatch<React.SetStateAction<number>>;
}
