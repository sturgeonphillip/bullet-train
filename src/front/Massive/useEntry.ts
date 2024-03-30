import { useState } from 'react';
import { createEntry, EntryProps, RoutineProps } from './createEntryM';

function useEntry(entryDate: string) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [entry, setEntry] = useState<EntryProps | null>(null);

  async function fetchEntry() {
    if (!entryDate) {
      console.error(`entryData is undefined.`);
      return null;
    }

    try {
      const res = await fetch(`http://localhost:3001/entry/${entryDate}`);
      if (!res.ok) {
        throw new Error('response not ok.');
      }

      const data = await res.json();
      console.log('data!', data);
      setEntry(data);
      return data; // return fetched data
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
      return null; // return null in case of error
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!entryDate) {
      return; // prevent making an empty request
    }

    const storedEntry = await fetchEntry();

    if (storedEntry) {
      setEntry(storedEntry);
    } else {
      setEntry(null);

      // prompt user to create entry
      setShowPrompt(true);
      return;
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

    // update entry in database
    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedEntry, // ensure most recent data
        }),
      };

      const res = await fetch(
        `http://locahost:3001/entry/${entryDate}`,
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

  async function handlePrompt(verdict: boolean) {
    if (verdict === true) {
      console.log('yes!');
      const entry = createEntry([], entryDate);

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      };

      try {
        const res = await fetch(
          `http://localhost:3001/entry/${entryDate}`,
          options
        );
        if (!res.ok) {
          throw new Error('Network response not ok.');
        }

        // after creating entry, fetch again to ensure latest data
        const createdEntry = await fetchEntry();
        setEntry(createdEntry);
      } catch (err) {
        console.error(
          `Caught error while trying to create entry for ${entryDate}. ${err}`
        );
      }
    } else {
      console.log('no entry will be created.');
    }

    setShowPrompt(false);
  }
  console.log(handlePrompt);

  return {
    entry,
    showPrompt,
    handlePrompt,
    handleSubmit,
    handleComplete,
    // dataError,
  };
}

export default useEntry;
