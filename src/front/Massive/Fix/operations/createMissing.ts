// import { useState } from 'react';

// const [tempWizard, setTempWizard] = useState(0);

// "The entry does not exist. Create it?"
export async function handleCreateMissing(
  verdict: boolean,
  setWizard: (num: number) => void
) {
  const entryDate = '2024-02-29';

  // yes, let's create it
  if (verdict === true) {
    setWizard(3); // next -> DisplayListOptions
    /**
     * currently:
     * const lists = await findPrecedingSucceedingPoints(inputDate);
     * setWizard(2);
     *
     * return
     * */

    // revamp to:
    // call next function and move on
    createMissingEntry(entryDate);
    setWizard(2);

    return;
  } else {
    // no, don't create it
    // return to default entry (today)
    // setEntry(today's entry);
    // setEntryDate(today's date);
    // setWizard(0);
  }
}

export function createMissingEntry(date?: unknown) {
  console.log(date);
  console.log('create a missing entry!');
}

// fetch list db
// sorts keys

const listDB: { [key: string]: string[] } = {
  '1970-01-01': ['Initiate the Unix Epoch'],
  '2001-02-23': ['Pray', 'Walk Dogs', 'Code'],
  '2024-02-21': ['Pray', 'Walk Dogs', 'Eat', 'Code'],
  '2024-02-23': ['Pray', 'Walk Dogs', 'Code'],
  '2024-03-16': ['Pray', 'Walk Dogs', 'Eat', 'Code', 'Watch Movie'],
};

export function findAdjacentDates(inputDate: string) {
  // ensure dates are sorted
  const sortedDates = Object.keys(listDB).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  console.log('SD', sortedDates);

  // find index of closest date before
  let beforeIndex = sortedDates.findIndex(
    (date) => new Date(date) >= new Date(inputDate)
  );
  console.log('BI', beforeIndex);

  if (beforeIndex === -1) {
    // if inputDate is after all existing dates, take last one
    beforeIndex = sortedDates.length - 1;
  }
  const beforeDate = sortedDates[beforeIndex - 1] as keyof typeof listDB;

  // find index of closest date after
  let afterIndex = sortedDates.findIndex(
    (date) => new Date(date) > new Date(inputDate)
  );
  if (afterIndex === -1) {
    // if input date is before all dates, take first one
    afterIndex = 0;
  }

  const afterDate = sortedDates[afterIndex] as keyof typeof listDB;

  // two closest dates and corresponding lists
  return {
    before: { date: beforeDate, tasks: listDB[beforeDate] },
    after: { date: afterDate, tasks: listDB[afterDate] },
  };
}

console.log(findAdjacentDates('1942-01-01'));
// console.log(findAdjacentDates('1970-01-01'));
// console.log(findAdjacentDates('2024-01-01'));
// console.log(findAdjacentDates('2024-08-25'));
