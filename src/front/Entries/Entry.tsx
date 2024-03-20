import { useState } from 'react';
import './index.css';
import Routine from '../Routines/Routine';
import { EntryProps, requestEntry } from './createEntry';
import PromptEntry from './Prompt/PromptEntry';
import { isoDateKey } from '../../utils/dateKey';
import unixEpoch from './epoch';

const Entry = () => {
  const today = isoDateKey();
  const [entryDate, setEntryDate] = useState(today);
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [error, setError] = useState('');
  const [entryPrompt, setEntryPrompt] = useState(false);

  const setEpoch = () => {
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
            onChange={(e) => {
              console.log('INPUT VALUE:', e.target.value);
              setEntryDate(e.target.value);
            }}
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
            setEpoch={setEpoch}
            cleanUp={() => setEntryPrompt(false)}
          />
        )}
        {entry && entry.routines && (
          <div>
            <ul>
              {entry.routines.map((r) => (
                <li key={r.id}>
                  <Routine {...r} />
                </li>
              ))}
            </ul>
          </div>
        )}
        <p>FORM: Add a Routine</p>
        {/* TODO add form: add a routine to entry */}
      </div>
    </>
  );
};

export default Entry;
