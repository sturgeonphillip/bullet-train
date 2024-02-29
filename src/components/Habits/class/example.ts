import Habits from './DailyHabits';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const today = Date.now();
const yesterday = today - 86400000;
const twoAgo = yesterday - 86400000;

const daily = ['row', 'pray', 'apply', 'code'];
const myRoutine = new Habits(today, daily);

const filePath = path.join(__dirname, '..', '..', '..', 'data', 'habits.json');

async function writeToFile(filePath: string, data: Record<string, unknown>) {
  const serialized = JSON.stringify(data);
  console.log('DATA', serialized);

  try {
    // ensure existing directory
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // read existing data
    let existingData = [];

    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (err) {
      if (err instanceof SyntaxError) {
        // if file is empty or starts with an empty array
        // existingData will be set to an empty array by default
        existingData = [];
      } else {
        console.error(`Error reading fileContent: ${err}`);
      }
    }

    // parse serialized data back into an object
    const parsedData = JSON.parse(serialized);

    // combine existing and new data
    const combinedData = [...existingData, parsedData];

    // write combined data back to file
    await fs.writeFile(filePath, JSON.stringify(combinedData));
    console.log('File written.');
  } catch (err) {
    console.error(`Error writing combinedData: ${err}`);
  }
}

async function main() {
  console.log('myRoutine!');
  await writeToFile(filePath, myRoutine.toJSON());
  myRoutine.setDate(yesterday);
  console.log('yesterday!');
  await writeToFile(filePath, myRoutine.toJSON());
  myRoutine.setDate(twoAgo);
  console.log('twoAgo!');
  await writeToFile(filePath, myRoutine.toJSON());
}

main();

async function getLength(file: string) {
  try {
    const data = await fs.readFile(file, 'utf8');

    const parsed = await JSON.parse(data);
    const content = parsed.slice(0, 3);
    const length = content.length;
    return await { length, content };
  } catch (err) {
    console.error(`Error reading file: ${err}`);
  }
}

const habitsFile = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'data',
  'habits.json'
);

async function showRes() {
  const result = await getLength(habitsFile);
  await console.log(result);
}

showRes();
