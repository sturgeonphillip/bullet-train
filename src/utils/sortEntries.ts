export interface ListProps {
  [dateKey: string]: string[];
}

export interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
}

export interface EntryProps {
  id: string;
  date: string;
  routines: RoutineProps[];
}

export interface EntriesObjectProps {
  [date: string]: EntryProps;
}

export function sortEntries(entriesObject: EntriesObjectProps) {
  const entriesArray = Object.entries(entriesObject);
  entriesArray.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  const sortedEntries = Object.fromEntries(entriesArray);

  return sortedEntries;
}
type WaterRecordProps = { [key: string]: number };
export function sortRecords(recordsObject: WaterRecordProps) {
  const recordsArray = Object.entries(recordsObject);
  recordsArray.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  const sortedRecords = Object.fromEntries(recordsArray);

  return sortedRecords;
}

// returns array of tuples from obj entries, keys as unix epoch numbers
export function sortTimeKeyRoutine(listObject: ListProps) {
  return Object.entries(listObject)
    .map((x) => {
      const time = new Date(x[0]).getTime();
      const str = x[1];
      return [time, str];
    })
    .sort((a: (number | string[])[], b: (number | string[])[]) => {
      return Number(a[0]) - Number(b[0]);
    });
}

// returns array of tuples from obj entries, keys as strings YYYY-MM-DD
export function sortStringKeyRoutine(listObject: ListProps) {
  return Object.entries(listObject)
    .map((x) => {
      const time = new Date(x[0]).getTime();
      const str = x[1];
      return [time, str];
    })
    .sort((a: (number | string[])[], b: (number | string[])[]) => {
      return Number(a[0]) - Number(b[0]);
    })
    .map((x) => {
      const dateStr = new Date(Number(x[0])).toISOString().split('T')[0];
      return [dateStr, x[1]];
    });
}
