export interface EntryProps {
  id: string;
  date: string;
  routines: RoutineProps[];
}

export interface DisplayEntryProps {
  inputDate: string;
  entry: EntryProps;
  setEntry: Dispatch<SetStateAction<EntryProps | null>>;
  wizard: number;
}

export interface DisplayMissingProps {
  inputDate: string;
  entry: EntryProps | null;
  setEntry: Dispatch<SetStateAction<EntryProps | null>>;
  handler: (verdict: boolean) => void;
  wizard: number;
  setWizard: Dispatch<SetStateAction<number>>;
}

export interface DisplayListOptionProps {
  inputDate: string;
  candidates: ListOptionProps[];
  createNewEntry?: (list: string[]) => void;
  wizard: number;
  setWizard: React.Dispatch<React.SetStateAction<number>>;
}

export interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}
