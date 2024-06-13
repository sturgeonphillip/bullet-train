import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../../db/list.json');

type ListProps = { [key: string]: string[] };

async function clearDups(obj: ListProps) {
  if (!obj) return 'empty';

  const entries = Object.entries(obj);

  for (let i = entries.length - 1; i >= 0; i--) {
    const a = entries[i][1];
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

export function sortEntries(entriesObject: ListProps) {
  const entriesArray = Object.entries(entriesObject);
  entriesArray.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  const sortedEntries = Object.fromEntries(entriesArray);

  return sortedEntries;
}

function checkSame(arr1: string[], arr2: string[]) {
  const arrSort1 = arr1.sort();
  const arrSort2 = arr2.sort();

  return JSON.stringify(arrSort1) === JSON.stringify(arrSort2);
}

async function processData(filePath: string) {
  try {
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    const cleanedData = await clearDups(data);
    console.log(cleanedData); // process further at this point
  } catch (err) {
    console.error(`Error reading or processing data: ${err}`);
  }
}

processData(filePath);

// const originalLength = Object.entries(data).length;
// const clean = clearDups(data);
// const modifiedLength = Object.entries(clean).length;

// console.log(
//   'original:',
//   originalLength,
//   'modified',
//   modifiedLength,
//   'clean',
//   clean
// );
