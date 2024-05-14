export const createTodayFromYesterday = async (date: string) => {
  let todayEntry;
  let yesterday;
  let routineList;
  try {
    const existingEntry = await getEntryByDate(date);
    if (!existingEntry) {
      console.log(
        `Delay: no entry found for today (${date}). Will build using routines from ${yesterday}. Creating now...`
      );
      // format yesterday's date
      yesterday = yesterdayDate(date);
      // fetch yesterday's' entry
      const yesterdayEntry = await getEntryByDate(yesterday);

      if (!yesterdayEntry) {
        // go back to the most recent entry list
        // TODO: refer to functions in operations/loadToday
      }

      routineList = yesterdayEntry.routines.map((x: RoutineProps) => x.name);

      todayEntry = createEntry(routineList, date);
      // return todayEntry;
    } else {
      console.log('Returning existing entry:', existingEntry);
      return existingEntry;
    }

    return todayEntry;
  } catch (err) {
    // TODO:log or handleError
    console.log('what goes here?', err);
    // handleError(err, res, 'Error creating an entry for today.')
  }
};

export function yesterdayDate(date: string) {
  let today;
  if (typeof date === 'string') {
    today = new Date(date).getTime();
  } else {
    today = Date.now();
  }
  const oneDay = 24 * 60 * 60 * 1000;
  const yesterday = new Date(today - oneDay).toISOString().split('T')[0];
  return yesterday;
}

const getEntryByDate = async (date: string) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const entries = JSON.parse(data);
    return entries[date];
  } catch (err) {
    console.error('Error reading entry:', err);
    // returning null is useful because it allows the calling code to handle the error gracefully without having to deal with the error directly within the getEntryByDate function, and it keeps the function's signature simple because it always returns a value (either the entry object or null).
    return null;
  }
};

// TODO: entry.controller.ts is too large.
// the createTodayEntry function in the entry.controller.ts file requires functions in this file.
// the createTodayFromYesterday function in this file needs createEntry and createRoutine (utils/factories).
// getEntryByDate needs the fs module.
// All of this needs to be refactored and rerouted file to file.
//
