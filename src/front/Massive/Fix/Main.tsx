import { useEffect, useState } from 'react';
import './fix.css';
import { DisplayEntry } from './DisplayEntry';
import { DisplayMissing } from './DisplayMissing';
import { DisplayListOption } from './DisplayListOption';
import { fetchEntry } from './fixFunctions';
// import {...} from './functions';
import { EntryProps } from './types';

const Main = () => {
  const [entryDate, setEntryDate] = useState('');
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [wizard, setWizard] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!entryDate) {
      // prevent an empty request
      return;
    }

    const storedEntry = await fetchEntry(entryDate);
    console.log('STORED', storedEntry);
    if (storedEntry) {
      setWizard(0);
      setEntry(storedEntry);
    } else {
      setEntry(null);
      setWizard(1);
    }
  }

  // async function handleCreateMissing(verdict: boolean) {}

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type='date'
          id='entry-date-id'
          name='entry-date'
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          className=''
        />
        <button type='submit'>GO</button>
      </form>

      <div>
        {wizard === 0 && entry && (
          <div>
            <DisplayEntry
              inputDate={entryDate}
              entry={entry}
              wizard={wizard}
              setEntry={setEntry}
            />
          </div>
        )}
        {wizard === 1 && (
          <div>
            <DisplayMissing
              inputDate={entryDate}
              entry={entry}
              setEntry={setEntry}
              handler={handleCreateMissing}
              wizard={wizard}
              setWizard={setWizard}
            />
          </div>
        )}
        {wizard === 2 && (
          <div>
            <DisplayListOption
              inputDate={entryDate}
              candidates={[]}
              wizard={wizard}
              setWizard={setWizard}
            />
          </div>
        )}
      </div>
    </>
  );
};

/**
 * useEffect
 * createEntry
 * fetchEntry
 */

export default Main;
