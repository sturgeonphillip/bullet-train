import { useState } from 'react';
import { EntryProps, RoutineProps } from './createEntryM';

export const useEntry = () => {
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [dataError, setDataError] = useState('');
  const [prompt, setPrompt] = useState(false);
  async function fetchEntry(entryDate: string) {
    if (!entryDate) {
      console.error(`entryData is undefined.`);
      return null;
    }

    try {
      const res = await fetch(`http://localhost:3001/${entryDate}`);
      if (!res.ok) {
        throw new Error('Network response error.');
      }

      const data = await res.json();
      return await data;
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
    }
  }

  async function handleSubmit(entryDate: string) {
    if (!entryDate) {
      setDataError('Please select a date.');
      return; // prevent making an empty request
    }

    const storedEntry = await fetchEntry(entryDate);

    if (storedEntry) {
      setEntry(storedEntry);
      setDataError(''); // clear any previous errors
    } else {
      setEntry(null);
      setDataError(`No entry found for ${entryDate}`);
      // ask user whether to create an entry for requested date.
      setPrompt(true);
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
          updatedEntry, // use updatedEntry directly to ensure most recent data
        }),
      };

      const res = await fetch(
        `http://locahost:3001/entry/${entryDate}`,
        options
      );

      if (!res.ok) {
        throw new Error('Failed to update routine in database.');
      }

      // TODO: handle the response body if it contains additional data
      // like update the state if server sends back the updated entry

      console.log('Routine updated successfully.');
    } catch (err) {
      console.error(`Error updating the routine: ${err}`);
    }
  }

  return { entry, prompt, handleSubmit, handleComplete, dataError };
};
