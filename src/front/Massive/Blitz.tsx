import { useState } from 'react';
import './indexM.css';
import Routine from './RoutinesM/RoutineM';
import { isoDateKey } from '../../utils/dateKey';
import {
  EntryProps,
  ListProps,
  RoutineProps,
  RoutineListProps,
} from './createEntryM';
import Prompter from './PromptM/PromptCarriage';

const Blitz = () => {
  const today = isoDateKey();
  const [entryDate, setEntryDate] = useState(today);
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [promptCarriage, setPromptCarriage] = useState(false);

  // interface
  const [showCreateDiv, setShowCreateDiv] = useState(false);
  const [showOptionsDiv, setShowOptionsDiv] = useState<ListProps | null>(null);
  const [showListDiv, setShowListDiv] = useState(false);
  const [listOptions, setListOptions] = useState<ListProps[] | null>(null);
  const [entryList, setEntryList] = useState<ListProps | null>(null);

  async function fetchEntry() {
    if (!entryDate) {
      console.error(`entry data is undefined.`);
      return null;
    }
    try {
      const res = await fetch(`http://localhost:3001/entry/${entryDate}`);

      if (!res.ok) {
        throw new Error('Response not okay in fetchEntry function.');
      }

      const data = await res.json();
      setEntry(data);
      return data;
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!entryDate) {
      setPromptCarriage(true);
      return;
    }
    const storedEntry = await fetchEntry();

    if (storedEntry) {
      setEntry(storedEntry);
    } else {
      setEntry(null);
      setPromptCarriage(true);
    }
  }

  async function handleComplete(entryDate: string, id: string) {
    if (!entry) {
      console.error('Entry is either null or undefined.');
      return;
    }

    const updatedEntry = {
      ...entry,
      routines: entry.routines.map((routine: RoutineProps) => {
        if (routine.id === id) {
          // check state of complete property
          if (routine.complete) {
            return {
              ...routine,
              complete: false,
              timestamp: 0,
            };
          } else {
            return {
              ...routine,
              complete: true,
              timestamp: Date.now(),
            };
          }
        }
        return routine;
      }),
    };
    setEntry(updatedEntry);

    // update db
    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedEntry }),
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
      <div className='massive-container-div'>
        <form onSubmit={handleSubmit}>
          <input
            type='date'
            id='entry-date-id'
            name='entry-date'
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className='entry-input-date'
          />
          <button type='submit'>dogs</button>
        </form>
      </div>

      {entry === null ? (
        <p className='nullEntry'>Entry for {entryDate} is null.</p>
      ) : (
        false
      )}
      {promptCarriage && (
        <div>
          <Prompter />
        </div>
      )}

      <div className='massive-routines-div'>
        {if (entry && entry.routines && entry.routines > 0) {

(          entry.routines.map((r) => (
            <Routine
              {...r}
              key={r.id}
              onComplete={() => handleComplete(entryDate, r.id)}
            />
)j          }}
          )}
        <div>
          {
            <>
              <h4>something, something, and something else.</h4>
              <p>{JSON.stringify(entry)}</p>
            </>
          }
        </div>
      </div>
    </>
  );
};

export default Blitz;
