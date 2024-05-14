import { useEffect, useState } from 'react';
import './fix.css';
import { DisplayEntry } from './DisplayEntry';
import { DisplayMissing } from './DisplayMissing';
import { DisplayListOption } from './DisplayListOption';
import { fetchEntry, isoDateKey } from './operations/fixFunctions';

import { EntryProps } from './types';
import { buildTodayEntry, postTodayEntry } from './operations/loadToday';

const Main = () => {
  const [entryDate, setEntryDate] = useState(isoDateKey());
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [wizard, setWizard] = useState(0);

  useEffect(() => {
    const createEntry = async () => {
      const todayEntry = await buildTodayEntry(entryDate);
      const newEntryData = await postTodayEntry(entryDate, todayEntry);

      setEntry(newEntryData);
    };

    createEntry();

    // const fetchData = async () => {
    //   try {
    //     const res = await fetch(`http://localhost:3001/entry/${entryDate}`);

    //     if (!res.ok) {
    //       throw new Error(`Unable to fetch entry. Response not ok.`);
    //     }

    //     const data = await res.json();
    //     setEntry(data);
    //   } catch (err) {
    //     console.error(`Network response error. ${err}`);
    //     return null;
    //   }
    // };
    // fetchData();
  }, [entryDate]);
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
      <div>
        <span>
          <a
            href='http://localhost:3001'
            target='_blank'
          >
            LINK
          </a>
        </span>
      </div>
      <hr />
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
