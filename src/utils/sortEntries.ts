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

// const datesObj = {
//   '2022-02-23': ['Pray', 'Walk Dogs', 'Code'],
//   '2027-02-21': ['Pray', 'Eat', 'Pick Up Dog Poop', 'Code'],
//   '2023-09-05': ['Nap', 'Every Day is Leg Day', 'Get a Slurpee'],
//   '2024-03-01': ['Read', 'Walk Dogs', 'Code'],
// };

// console.log(sortTimeKeyRoutine(datesObj));
// console.log(sortStringKeyRoutine(datesObj));
