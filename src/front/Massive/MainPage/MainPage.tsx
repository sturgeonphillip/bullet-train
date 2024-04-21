import { useState } from 'react';
import {
  createEntry,
  fetchEntry,
  isoDateKey,
  findAppropriateRoutineLists,
} from './mainPageFunctions';
import {
  RoutineProps,
  EntryProps,
  DisplayEntryProps,
  DisplayMissingProps,
  DisplayListProps,
  ListOptionProps,
} from './mainPageTypes';

// component for current day's entry of routines
// or entry based on user input
const Main = () => {
  const today = isoDateKey();
  const [wizard, setWizard] = useState(0);
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [entryDate, setEntryDate] = useState(today);
  const [listOptions, setListOptions] = useState<ListOptionProps[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!entryDate) {
      return; // prevent an empty request
    }
    console.log('entryDate');

    const storedEntry = await fetchEntry(entryDate);
    console.log('stored', storedEntry);
    if (storedEntry) {
      console.log('storedEntry');
      setWizard(0);
      setEntry(storedEntry);
    } else {
      console.log(`
        setEntry(null);
        setWizard(1);
        `);
      setEntry(null);
      setWizard(1); // prompt user to create entry
    }
  }

  async function handleCreateMissing(verdict: boolean) {
    if (verdict === true) {
      /**
       *
       */
      const lists = await findAppropriateRoutineLists(entryDate);
      setListOptions(lists);
      setWizard(2);
      return;
    } else {
      setEntry(entry);
      setWizard(0);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type='date'
          id='entry-date-id'
          name='entry-date'
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          className='entry-input=date'
        />
        <button type='submit'>GO</button>
      </form>

      <div>
        {wizard === 0 && entry && (
          <DisplayEntry
            entry={entry}
            wizard={wizard}
            setEntry={setEntry}
            entryDate={entryDate}
          />
        )}
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
        {wizard === 2 && (
          <DisplayList
            candidates={listOptions}
            inputDate={entryDate}
            createNewEntry={createEntry}
            wizard={wizard}
            setWizard={setWizard}
          />
        )}
      </div>
      <div>
        {/* show entry using DisplayEntry */}
        {/* or if no entry in db, show DisplayMissing to ask user if they want to create an entry.
         
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
          */}
      </div>
    </>
  );
};

// default active display component
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
    setEntry(updatedEntry);

    // update entry in database
    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'appliction/json',
        },
        body: JSON.stringify({
          updatedEntry, // ensure most recent data
        }),
      };

      const res = await fetch(
        `http://localhost:3001/entry/${entryDate}`,
        options
      );
      if (!res.ok) {
        throw new Error('Failed to update routine in database.');
      }
      console.log('Routine updated successfully.');
    } catch (err) {
      console.error(`Error updating the routine: ${err}`);
    }
  }

  return (
    <>
      <div className='routines-div'>
        {entry && entry.routines.length > 0 ? (
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
  // createNewEntryFromList,
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
            <p>{before[0]} is the closest date with a saved routine list.</p>
          </>
        )}
      </div>
      <div>
        <span>
          <button
            onClick={() => chooseList(before[1], inputDate)}
            className='pe-btn before'
          >
            {before[0]}
          </button>
          <ul>
            {before[1].map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
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
            {after[1].map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
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
      <li
        className='entry-routine-li'
        key={id}
      >
        <div
          id={id}
          className='routine-container-div'
        >
          <input
            type='checkbox'
            id={id}
            checked={complete}
            onChange={handleToggle}
            className='routine-checkbox'
          />
          <p>{name}</p>{' '}
        </div>
      </li>
    </>
  );
};

export default Main;
