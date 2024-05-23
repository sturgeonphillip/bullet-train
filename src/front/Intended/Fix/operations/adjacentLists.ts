export async function handleCreateMissing(
  verdict: boolean,
  showToday: () => void,
  setWizard: (num: number) => void
) {
  // when entry does not exist, does user want to create it?

  // yes, create it
  if (verdict === true) {
    setWizard(2); // next -> DisplayListOptions

    // revamp to:
    // call next function and move on
    // TODO: incorporate loader while fetching the appropriate lists
    // handleListOption(entryDate);
    // setWizard(2);

    return;
  } else {
    // no, don't create it
    showToday();
    // return to default entry (today)
    // setEntry(today's entry);
    // setEntryDate(today's date);
    // setWizard(0);
  }
}
export interface ListOptionProps {
  before: {
    date: string | null;
    tasks: string[];
  };
  after: {
    date: string | null;
    tasks: string[];
  };
}

// export function handleListOption(
//   inputDate: string,
//   listOption: ListOptionProps
// ) {
//   // TODO: incorporate loader while fetching the appropriate lists
//   console.log(inputDate);
//   console.log(listOption);
//   console.log('create a missing entry!');
// }

interface ListProps {
  [key: string]: string[];
}
export function findAdjacentDates(inputDate: string, listDB: ListProps) {
  console.log('inputDate:', inputDate);

  // create a sorted array of date keys
  const sortedDates = Object.keys(listDB).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // find index of closest date before inputDate
  const beforeIndex = sortedDates.findIndex(
    (date) => new Date(date) >= new Date(inputDate)
  );

  // if inputDate is before all existing dates, set beforeDate to inputDate and tasks to empty array
  if (beforeIndex <= 0) {
    return {
      before: { date: inputDate, tasks: [] },
      after: { date: sortedDates[0], tasks: listDB[sortedDates[0]] },
    };
  }

  const beforeDate = sortedDates[beforeIndex - 1] as keyof typeof listDB;

  // find index of closest date after inputDate
  const afterIndex = sortedDates.findIndex(
    (date) => new Date(date) > new Date(inputDate)
  );
  // if input date is after all dates, set afterDate to inputDate and tasks to an empty array
  if (afterIndex === -1) {
    return {
      before: {
        date: sortedDates[sortedDates.length - 1],
        tasks: listDB[sortedDates[sortedDates.length - 1]],
      },
      after: { date: inputDate, tasks: [] },
    };
  }

  const afterDate = sortedDates[afterIndex] as keyof typeof listDB;

  return {
    before: { date: beforeDate, tasks: listDB[beforeDate] },
    after: { date: afterDate, tasks: listDB[afterDate] },
  };
}

export async function getAdjacentLists(inputDate: string) {
  let listData: ListProps = {};
  try {
    const res = await fetch(`http://localhost:3001/list`);

    if (!res.ok) {
      throw new Error('Unable to fetch list data from server.');
    }

    listData = await res.json();

    return findAdjacentDates(inputDate, listData);
  } catch (err) {
    console.error(`Error caught: ${err}`);
  }
}
