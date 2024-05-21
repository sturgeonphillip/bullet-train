import { useState } from 'react';
import './index.css';
import { EntryProps, requestEntry } from './createEntry';
import PromptEntry from './Prompt/PromptEntry';
import { isoDateKey } from '../../utils/dateKey';
import { unixEpoch } from './epoch';
import RoutineDisplay from '../Routines/Display';
import { useRoutines } from '../Routines/useRoutines';

const Entry = () => {
  const today = isoDateKey();
  const [entryDate, setEntryDate] = useState(today);
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [error, setError] = useState('');
  const [entryPrompt, setEntryPrompt] = useState(false);
  // TODO: better name for this hook
  const { routines, handleComplete } = useRoutines(entryDate);

  const showEpoch = () => {
    setEntryDate('1970-01-01');
    setEntry(unixEpoch);
    setEntryPrompt(false);
  };

  const handleEntryDate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!entryDate) {
      setError('Please select a date.');
      return; // prevent making a request with empty date
    }

    try {
      const storedEntry = await requestEntry(entryDate);
      if (storedEntry) {
        setEntry(storedEntry);
        setError(''); // clear any previous error
      } else {
        setEntry(null);
        setError('No entry found for the given date.');
        // ask user if they would like to create an entry for the provided date.
        setEntryPrompt(true);
      }
    } catch (err) {
      console.error('Error fetching entry:', err);
      setError('An error ocurred while fetching the entry.');
    }
  };

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
          <button
            className='ce-btn'
            type='submit'
          >
            go
          </button>
        </form>
        {error && <p className='error-message'>{error}</p>}
        {entryPrompt && (
          <PromptEntry
            inputDate={entryDate}
            showEpoch={showEpoch}
            cleanUp={() => setEntryPrompt(false)}
          />
        )}
        {(entry && entry.routines && (
          <RoutineDisplay
            routines={routines}
            handleComplete={handleComplete}
          />
        )) ?? <p>nothing to see here!</p>}
        {/* <RoutineForm
          onNewRoutineAdd={function (): void {
            throw new Error('Function not implemented.');
          }}
        /> */}
      </div>
    </>
  );
};

export default Entry;
