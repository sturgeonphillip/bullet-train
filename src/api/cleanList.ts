function clearDups(obj) {
  if (!obj) return 'empty';

  const entries = Object.entries(obj);

  for (let i = entries.length - 1; i >= 0; i--) {
    let a = entries[i][1];
    let b;

    if (i + 1 < entries.length) {
      b = entries[i + 1][1];
    }

    if (b !== undefined) {
      if (checkSame(a, b) === true) {
        delete entries[i + 1];
      }
    }
  }

  const filteredEntries = entries.filter((entry) => entry !== undefined);
  const cleanObj = Object.fromEntries(filteredEntries);
  return sortEntries(cleanObj);
}

export function sortEntries(entriesObject) {
  const entriesArray = Object.entries(entriesObject);
  entriesArray.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  const sortedEntries = Object.fromEntries(entriesArray);

  return sortedEntries;
}

function checkSame(arr1, arr2) {
  const arrSort1 = arr1.sort();
  const arrSort2 = arr2.sort();

  return JSON.stringify(arrSort1) === JSON.stringify(arrSort2);
}

const a = ['Pray', 'Walk Dogs', 'Code'];
const b = ['Pray', 'Walk Dogs', 'Code', 'Row'];
const c = ['Pray', 'Walk Dogs', 'Apply to Jobs'];
const d = ['Pray', 'Walk Dogs', 'Code', 'Row'];
const e = ['Pray', 'Walk Dogs', 'Apply to Jobs'];

console.log(checkSame(a, b)); // false
console.log(checkSame(a, c)); // false
console.log(checkSame(b, c)); // false
console.log(checkSame(b, d)); // true
console.log(checkSame(c, e)); // true

const data = {
  '1970-01-01': ['Unix Epoch'],
  '2024-02-21': ['Pray', 'Walk Dogs', 'Eat', 'Code'],
  '2024-02-23': ['Pray', 'Walk Dogs', 'Code'],
  '2024-03-16': ['Pray', 'Walk Dogs', 'Eat', 'Code', 'Watch Movie'],
  '2024-03-26': ['Pray', 'Walk Dogs', 'Code', 'Prep for NAB'],
  '2024-03-25': ['Pray', 'Walk Dogs', 'Code', 'Prep for NAB'],
  '2024-04-01': ['Pray', 'Walk Dogs', 'Code'],
  '2024-04-02': ['Pray', 'Walk Dogs'],
  '2024-04-03': ['Pray', 'Walk Dogs', 'Row'],
  '2024-04-20': ['Pray', 'Walk Dogs', 'Apply for Jobs'],
  '2024-03-29': ['Pray', 'Walk Dogs', 'Code', 'Prep for NAB'],
  '2024-03-27': ['Pray', 'Walk Dogs', 'Code', 'Prep for NAB'],
  '2024-04-21': ['Pray', 'Walk Dogs', 'Code'],
  '2024-04-26': ['Pray', 'Walk Dogs', 'Code'],
  '2024-04-22': ['Pray', 'Code', 'Chores'],
  '2024-04-23': ['Pray', 'Walk Dogs', 'Code', 'Row', 'Fix Fetch Calls'],
  '2024-05-01': ['Pray', 'Walk Dogs', 'Code'],
  '2024-05-02': ['Pray', 'Code'],
  '2024-05-09': ['Pray', 'Code'],
  '2024-05-05': ['Pray', 'Code'],
  '2024-05-12': ['Pray', 'Code'],
  '2024-05-03': ['Pray', 'Walk Dogs', 'Code'],
  '2024-05-20': ['Pray', 'Walk Dogs', 'Code', 'Row'],
  '2024-05-21': ['Pray', 'Walk Dogs', 'Apply to Jobs'],
  '2024-05-22': ['Pray', 'Walk Dogs', 'Workout'],
  '2024-05-23': ['Pray', 'Walk Dogs', 'Code', 'Row', 'Fix Fetch Calls'],
  '2024-05-26': ['Make Guacamole'],
};

const originalLength = Object.entries(data).length;
const clean = clearDups(data);
const modifiedLength = Object.entries(clean).length;

console.log(
  'original:',
  originalLength,
  'modified',
  modifiedLength,
  'clean',
  clean
);
