import { useEffect, useState } from 'react';
import './fix.css';
import { DisplayEntry } from './DisplayEntry';
import { DisplayMissing } from './DisplayMissing';
import { DisplayListOption } from './DisplayListOption';
import {
  fetchEntry,
  isoDateKey,
  fetchOrCreateTodayEntry,
} from './operations/fixFunctions';
// import { loadToday } from './operations/loadToday';
import { EntryProps } from './types';

const Main = () => {
  const [entryDate, setEntryDate] = useState(isoDateKey());
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [wizard, setWizard] = useState(0);

  useEffect(() => {
    fetchOrCreateTodayEntry(entryDate, setEntry);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!entryDate) {
      return; // prevent an empty request
    }

    const submittedEntry = await fetchEntry(entryDate);
    console.log('STORED', submittedEntry);
    if (submittedEntry) {
      setEntry(submittedEntry);
      setWizard(0);
    } else {
      setEntry(null);
      setWizard(1);
    }
  }

  function handleMissingEntry(verdict: boolean) {
    if (verdict === true) {
      console.log('TRUE');
      setWizard(2);
    } else if (verdict === false) {
      console.log('FALSE');
      setEntry(null);
      setEntryDate(isoDateKey());
      setWizard(0);
    }
    return;
  }

  function renderWizard() {
    switch (wizard) {
      case 0:
        return (
          <div>
            <DisplayEntry
              inputDate={entryDate}
              entry={entry}
              wizard={wizard}
              setEntry={setEntry}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <DisplayMissing
              inputDate={entryDate}
              handler={(verdict) => handleMissingEntry(verdict)}
              wizard={wizard}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <DisplayListOption
              inputDate={entryDate}
              candidates={[]}
              wizard={wizard}
              setWizard={setWizard}
            />
          </div>
        );

      // TODO: is this default case necessary or repetitive? what's a fail safe?
      default:
        return (
          <div>
            <DisplayEntry
              inputDate={entryDate}
              entry={entry}
              wizard={wizard}
              setEntry={setEntry}
            />
          </div>
        );
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
          className=''
        />
        <button type='submit'>GO</button>
      </form>

      <div>{renderWizard()}</div>
    </>
  );
};

export default Main;
