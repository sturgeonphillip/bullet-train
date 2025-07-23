// export async function handleCreateMissing(
//   verdict: boolean,
//   showToday: () => void,
//   setWizard: (num: number) => void
// ) {
//   // when entry does not exist, does user want to create it?

//   // yes, create it
//   if (verdict === true) {
//     setWizard(2); // next -> DisplayListOptions

//     // revamp to:
//     // call next function and move on
//     // TODO: incorporate loader while fetching the appropriate lists
//     // handleListOption(entryDate);
//     // setWizard(2);

//     return;
//   } else {
//     // no, don't create it
//     showToday();
//     // return to default entry (today)
//     // setEntry(today's entry);
//     // setEntryDate(today's date);
//     // setWizard(0);
//   }
// }
// export interface ListOptionProps {
//   before: {
//     date: string | null;
//     tasks: string[];
//   };
//   after: {
//     date: string | null;
//     tasks: string[];
//   };
// }

// // export function handleListOption(
// //   inputDate: string,
// //   listOption: ListOptionProps
// // ) {
// //   // TODO: incorporate loader while fetching the appropriate lists
// //   console.log(inputDate);
// //   console.log(listOption);
// //   console.log('create a missing entry!');
// // }

// interface ListProps {
//   [key: string]: string[];
// }
// export function findAdjacentDates(inputDate: string, listDB: ListProps) {
//   console.log('inputDate:', inputDate);

//   // create a sorted array of date keys
//   const sortedDates = Object.keys(listDB).sort(
//     (a, b) => new Date(a).getTime() - new Date(b).getTime()
//   );

//   // find index of closest date before inputDate
//   const beforeIndex = sortedDates.findIndex(
//     (date) => new Date(date) >= new Date(inputDate)
//   );

//   // if inputDate is before all existing dates, set beforeDate to inputDate and tasks to empty array
//   if (beforeIndex <= 0) {
//     return {
//       before: { date: inputDate, tasks: [] },
//       after: { date: sortedDates[0], tasks: listDB[sortedDates[0]] },
//     };
//   }

//   const beforeDate = sortedDates[beforeIndex - 1] as keyof typeof listDB;

//   // find index of closest date after inputDate
//   const afterIndex = sortedDates.findIndex(
//     (date) => new Date(date) > new Date(inputDate)
//   );
//   // if input date is after all dates, set afterDate to inputDate and tasks to an empty array
//   if (afterIndex === -1) {
//     return {
//       before: {
//         date: sortedDates[sortedDates.length - 1],
//         tasks: listDB[sortedDates[sortedDates.length - 1]],
//       },
//       after: { date: inputDate, tasks: [] },
//     };
//   }

//   const afterDate = sortedDates[afterIndex] as keyof typeof listDB;

//   return {
//     before: { date: beforeDate, tasks: listDB[beforeDate] },
//     after: { date: afterDate, tasks: listDB[afterDate] },
//   };
// }

// export async function getAdjacentLists(inputDate: string) {
//   let listData: ListProps = {};
//   try {
//     const res = await fetch(`http://localhost:3001/list`);

//     if (!res.ok) {
//       throw new Error('Unable to fetch list data from server.');
//     }

//     listData = await res.json();

//     return findAdjacentDates(inputDate, listData);
//   } catch (err) {
//     console.error(`Error caught: ${err}`);
//   }
// }

import { ListProps, AdjacentListsResult, ApiError } from '../types'
import { apiClient } from './apiClient'

function findAdjacentDates(
  inputDate: string,
  listDB: ListProps
): AdjacentListsResult {
  const inputTime = new Date(inputDate).getTime()
  const sortedDates = Object.keys(listDB)
    // only consider dates with tasks/routines
    .filter((date) => listDB[date]?.length > 0)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  if (sortedDates.length === 0) {
    return {
      before: { date: inputDate, practices: [] },
      after: { date: inputDate, practices: [] },
    }
  }

  // find last date before input date
  let beforeDate = null
  let beforeRoutines: string[] = []

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    if (new Date(sortedDates[i]).getTime() < inputTime) {
      beforeDate = sortedDates[i]
      beforeRoutines = listDB[beforeDate]
      break
    }
  }

  let afterDate = null
  let afterRoutines: string[] = []

  for (let i = 0; i < sortedDates.length; i++) {
    if (new Date(sortedDates[i]).getTime() > inputTime) {
      afterDate = sortedDates[i]
      afterRoutines = listDB[afterDate]
      break
    }
  }

  return {
    before: {
      date: beforeDate || inputDate,
      practices: beforeRoutines,
    },
    after: {
      date: afterDate || inputDate,
      practices: afterRoutines,
    },
  }
}

export async function getAdjacentLists(
  inputDate: string
): Promise<AdjacentListsResult> {
  try {
    const listData = await apiClient.fetchLists()
    return findAdjacentDates(inputDate, listData)
  } catch (err) {
    console.error('Error feching adjacent lists:', err)
    throw new ApiError({
      message: 'Unable to fetch list data for adjacent dates.',
    })
  }
}
