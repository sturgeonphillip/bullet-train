/**
 * 1 read json file using fs
 * 2 parse json string - convert into js object with JSON.parse()
 * 3 convert to an array of k:v pairs with Object.entries()
 * 4 sort by key with sort(), comparing keys chronologically
 * 5 convert sorted array back into an object with Object.fromEntries()
 * 6 stringify object using JSON.stringify()
 * 7 write back to file using fs
 */
interface ListProps {
  [dateKey: string]: string[];
}

interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
}

interface EntryProps {
  id: string;
  date: string;
  routines: RoutineProps[];
}

interface EntriesObjectProps {
  [date: string]: EntryProps;
}

export default function sortEntries(entriesObject: EntriesObjectProps) {
  const entriesArray = Object.entries(entriesObject);
  entriesArray.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  const sortedEntries = Object.fromEntries(entriesArray);

  return sortedEntries;
}

export function sortRoutineList(listObject: ListProps) {
  return Object.keys(listObject)
    .map((x) => new Date(x).getTime())
    .sort((a, b) => a - b);
}

// const dates = {
//   '2024-02-23': ['Pray', 'Walk Dogs', 'Code'],
//   '2024-02-21': ['Pray', 'Walk Dogs', 'Eat', 'Code'],
//   '2023-09-05': ['Nap', 'Every Day is Leg Day', 'Get a Slurpee'],
//   '2024-03-01': ['Pray', 'Walk Dogs', 'Code'],
// };

// console.log(sortRoutineList(dates));
