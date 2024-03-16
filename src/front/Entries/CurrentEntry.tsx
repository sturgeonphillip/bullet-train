import { useState } from 'react';
import './index.css';
import ExampleRoutine from './Example.tsx';
import { EntryProps, requestEntry } from './createEntry';

const CurrentEntry = () => {
  const [entryDate, setEntryDate] = useState('');
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [error, setError] = useState('');

  const handleEntryDate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!entryDate) {
      setError('Please select a date.');
      return; // prevent making a request with an empty date
    }

    try {
      const storedEntry = await requestEntry(entryDate);
      if (storedEntry) {
        setEntry(storedEntry);
        setError(''); // clear previous error
      } else {
        setEntry(null);
        setError('No entry found for the given date.');
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
        {entry && entry.routines && (
          <div>
            <ul>
              {entry.routines.map((r) => (
                <li key={r.id}>
                  <ExampleRoutine {...r} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentEntry;
