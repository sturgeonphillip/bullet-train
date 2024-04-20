import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import useMainEntry from './useMainEntry';

const Main = () => {
  const {
    handleSubmit,
    isoDateKey,
    createRoutine,
    createEntry,
    fetchEntry,
    findAppropriateRoutineList,
    listWithKey,
  } = useMainEntry();

  const today = isoDateKey();
  const [entryDate, setEntryDate] = useState(today);

  return (
    <>
      <h1>Main Page</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type='date'
            id='entry-date-id'
            name='entry-date'
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className='entry-input-date'
          />
          <button type='submit'>GO</button>
        </form>
      </div>
      <div>{/* show conditional render entry, createEntry, chooselist */}</div>
    </>
  );
};

export default Main;

// const DisplayEntry = () => {};
