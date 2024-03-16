import { useState } from 'react';
import './index.css';
import unixEpoch from './epoch.ts';
import ExampleRoutine from './Example.tsx';
import { EntryProps, createEntry, requestEntry } from './createEntry';
// import Routine from '../Routines/Routine';

// const startEntry = createEntry(['Walk Dogs', 'Row', 'Pray']);

const CurrentEntry = () => {
  const [entryDate, setEntryDate] = useState('1970-01-01');
  const [entry, setEntry] = useState<EntryProps>(unixEpoch);

  const handleEntryDate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const storedEntry = await requestEntry(entryDate);
    if (storedEntry !== null) {
      setEntry(storedEntry);
    } else {
      setEntryDate('1970-01-01');
      // setStr(unixEpoch);
    }
  };

  console.log(entryDate);
  return (
    <>
      <div className='ce-container-div'>
        <form onSubmit={handleEntryDate}>
          <input
            name='entry-date'
            type='date'
            id='entry-date'
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className='ce-input-date'
          />
          {/* {current} */}
          <button
            className='ce-btn'
            type='submit'
          >
            go
          </button>
        </form>
        <div>
          {/* <p>{entry.id}</p>
          <p>{entry.date}</p> */}
          <ul>
            {entry.routines.map((r) => (
              <li key={r.id}>
                <ExampleRoutine {...r} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CurrentEntry;

/** handleEntryDate notes! */
// 1. user input changes the date
// 2. user clicks get entry submit button
// 3. this function:
/** when called:
 * the value of entryDate is used as the req params on the fetch request run by requestEntry
 * success for requestEntry: retrieves the stored data for the entry and sets it as the state using setEntry()
 * IF the date is in the future (ie today is 3/15/24 and the user inputs 6/21/24), the user is prompted with something like, "great scott, marty! we don't have any record of this date. would you like to create it?"
 * * We will need to error handle: if the user creates a future date and adds a new routine, we will need to make sure that we account for the newly added routine, as well as introducing it only on the specified date and afterward.
 * * ==> when fetching latest errands to automatically create the new entry "for tomorrow" (at change of clocks with cron job), we can retrieve errand list with most recent date that is not later than today's date. this way, if the user creates a future entry and then adds a new routine (or deletes a routine), we add the future entry to our entry database and add a key:val to our lists database {date of future entry: [array of routines as modified by user]}
 *
 */

/**
 * async function requestEntry(entryDate: string) {
    try {
      const res = await fetch(`http://localhost:3001/entry/${entryDate}`);
      if (!res.ok) {
        throw new Error('Network response error.');
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Network response error.', err);
      return null; // indicate failure
    }
  }
 */
