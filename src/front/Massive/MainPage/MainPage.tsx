import { useEffect, useState } from 'react';
import './main.css';
import {
  createEntry,
  fetchEntry,
  findPrecedingSucceedingPoints,
  isoDateKey,
  fetchToday,
} from './mainPageFunctions';
import {
  RoutineProps,
  EntryProps,
  DisplayEntryProps,
  DisplayMissingProps,
  DisplayListProps,
  // ListOptionProps,
} from './mainPageTypes';

// component for current day's entry of routines
// or entry based on user input
const Main = () => {
  // const epoch = '1970-01-01';
  const [entryDate, setEntryDate] = useState('');
  const [wizard, setWizard] = useState(0);
  const [entry, setEntry] = useState<EntryProps | null>({
    id: '4mem4d1s-liv3-t4lk-54v3-d35ir0u5',
    date: '1970-01-01',
    routines: [
      {
        id: 'gr85c0tt-gig4-w4tt-wh04-drv88mph',
        name: 'Initiate the Unix Epoch',
        complete: true,
        timestamp: 1712127389929,
      },
    ],
  });

  /**
   * Remember: If there's any asynchronous operation triggered by the entryDate state change (e.g., fetching data based on the date), ensure that these operations do not inadvertently reset the state or cause unnecessary re-renders.
   */

  useEffect(() => {
    const today = isoDateKey();

    fetchToday({ today, setEntry, setEntryDate });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!entryDate) {
      return; // prevent an empty request
    }

    const storedEntry = await fetchEntry(entryDate);
    if (storedEntry) {
      console.log('storedEntry');
      setWizard(0);
      setEntry(storedEntry);
    } else {
      setEntry(null);
      setWizard(1); // prompt user to create entry
    }
  }

  async function handleCreateMissing(verdict: boolean) {
    if (verdict === true) {
      /**
       *
       */
      const lists = await findPrecedingSucceedingPoints(entryDate);
      console.log('hcm', lists);
      // setListOptions(lists);
      setWizard(2);
      return;
    } else {
      console.log('SET ENTRY DECLINED', entry);
      // const entry = await fetchEntry(isoDateKey());
      setEntry(entry);
      setEntryDate(isoDateKey());
      setWizard(0);
    }
  }

  console.log('ENTRY', entry);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type='date'
          id='entry-date-id'
          name='entry-date'
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          className='entry-input-date'
        />
        <button type='submit'>GO</button>
      </form>

      <div>
        {/* display current entry routine data */}
        {wizard === 0 && entry && (
          <DisplayEntry
            entry={entry}
            wizard={wizard}
            setEntry={setEntry}
            entryDate={entryDate}
          />
        )}

        {/* display when no entry exists for date */}
        {wizard === 1 && (
          <DisplayMissing
            entry={entry}
            setEntry={setEntry}
            inputDate={entryDate}
            wizard={wizard}
            setWizard={setWizard}
            handler={handleCreateMissing}
          />
        )}

        {/* display options to use if creating new entry */}
        {wizard === 2 && (
          <DisplayList
            candidates={[
              ['', ['', '']],
              ['', ['', '', '']],
            ]}
            inputDate={entryDate}
            createNewEntry={createEntry}
            wizard={wizard}
            setWizard={setWizard}
          />
        )}
      </div>
    </>
  );
};

/* show entry using DisplayEntry */

/* or if no entry in db, show DisplayMissing to ask user if they want to create an entry.
         
          if user clicks no:
          stop showing DisplayMissing
          setEntry(today)

          if user clicks yes:
          stop showing DisplayMissing
          show DisplayList so they can choose which list to use when creating the new entry.
         
          then, when user decides which list:
          use other logic to create the new entry
          setEntry(NewlyCreatedEntry)
          stop showing DisplayList, show DisplayEntry
          */

// default to active display component
// it shows the entry for the provided entry date
export const DisplayEntry = ({
  wizard,
  entry,
  setEntry,
  entryDate,
}: DisplayEntryProps) => {
  if (wizard !== 0) {
    return null;
  }

  async function handleComplete(entryDate: string, id: string) {
    if (!entry) {
      console.error('Entry is either null or undefined.');
      return;
    }

    const updatedEntry = {
      ...entry,
      routines: entry.routines.map((r: RoutineProps) => {
        if (r.id === id) {
          if (r.complete) {
            return {
              ...r,
              complete: false,
              timestamp: 0,
            };
          } else {
            return {
              ...r,
              complete: true,
              timestamp: Date.now(),
            };
          }
        }
        return r;
      }),
    };
    console.log('setEntry(updatedEntry)', updatedEntry);
    setEntry(updatedEntry);

    // update entry in database
    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEntry), // ensure most recent data
      };

      const res = await fetch(
        `http://localhost:3001/entry/${entryDate}`,
        options
      );
      if (!res.ok) {
        throw new Error('Failed to update routine in database.');
      }

      console.log('Routine updated successfully.');
      console.log('UPDATE:', updatedEntry);
    } catch (err) {
      console.error(`Error updating the routine: ${err}`);
    }
  }

  return (
    <>
      <div className='routines-div'>
        {entry && entry.routines ? (
          entry.routines.length > 0 ? (
            entry.routines.map((r) => (
              <Routine
                {...r}
                key={r.id}
                onComplete={() => handleComplete(entryDate, r.id)}
              />
            ))
          ) : (
            <>
              <h4>Entry for {entryDate} is empty.</h4>
              <p>Add some routines.</p>
            </>
          )
        ) : (
          <p>This entry has no routines.</p>
        )}
      </div>
    </>
  );
};

// component active when an entry for the requested date doesn't exist
// it asks the user if they would like to create the missing entry
export const DisplayMissing = ({
  inputDate,
  wizard,
  handler,
}: DisplayMissingProps) => {
  if (wizard !== 1) {
    return null;
  }

  return (
    <>
      <h3>No entry found.</h3>
      <p>Would you like to create an entry for {inputDate}?</p>
      <button
        className='pe-btn-yes'
        onClick={() => handler(true)}
      >
        Yes
      </button>
      <button
        className='pe-btn-yes'
        onClick={() => handler(false)}
      >
        No
      </button>
    </>
  );
};

// component active when creating a missing entry
// asks user which list to use to populate
export const DisplayList = ({
  wizard,
  setWizard,
  candidates,
  inputDate,
}: DisplayListProps) => {
  if (wizard !== 2) {
    return null;
  }

  const [before, after] = candidates;

  function chooseList(list: string[], entryDate: string) {
    // logic to choose list
    // ...other code
    createEntry(list, entryDate);
    setWizard(0);
  }

  return (
    <>
      <div>
        <h3>No entry found.</h3>

        <p>What routines should be on the entry for {inputDate}?</p>
        {after ? (
          <>
            <p>
              <code>{before[0]}</code> is the latest preceding date with a
              routine.
            </p>
            <p>
              <code>{after[0]}</code> is earliest date after it.
            </p>
          </>
        ) : (
          <>
            <p>{before} is the closest date with a saved routine list.</p>
          </>
        )}
      </div>
      {/* <DisplayOption
        inputDate={inputDate}
        option={before}
      /> */}
      <div>
        <span>
          <button
            onClick={() => chooseList(before[1], inputDate)}
            className='pe-btn before'
          >
            {before[0]}
          </button>
          <ul>
            {before[1].length > 0 ? (
              before[1].map((item, idx) => <li key={idx}>{item}</li>)
            ) : (
              <p>No routines saved.</p>
            )}
          </ul>
        </span>
        <span>
          <button
            onClick={() => chooseList(after[1], inputDate)}
            className='pe-btn after'
          >
            {after[0]}
          </button>
          <ul>
            {after[1].length > 0 ? (
              after[1].map((item, idx) => <li key={idx}>{item}</li>)
            ) : (
              <p>No routines saved.</p>
            )}
          </ul>
        </span>
        <span>
          <button
            onClick={() => chooseList([], inputDate)}
            className='pe-btn'
          >
            Create {inputDate} as empty.
          </button>
        </span>
      </div>
    </>
  );
};

const Routine = ({ id, name, complete, onComplete }: RoutineProps) => {
  function handleToggle() {
    if (onComplete) {
      onComplete(id);
    }
  }
  return (
    <>
      {/* <div
        id={id}
        className='routine-container-div'
      > */}
      <li
        className='entry-routine-li'
        key={id}
      >
        <input
          type='checkbox'
          id={id}
          checked={complete}
          onChange={handleToggle}
          className='routine-checkbox'
        />
        <p className='routine-name-p'>{name}</p>
      </li>
      {/* </div> */}
    </>
  );
};

export default Main;
