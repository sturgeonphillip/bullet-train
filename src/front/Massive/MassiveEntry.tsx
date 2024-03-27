import { useState } from 'react';
import './indexM.css';
import Routine from './RoutinesM/RoutineM';
// import { EntryProps } from './createEntryM';
// import { leap, unixEpoch } from '../Entries/epoch';
// import PromptEntry from '../Entries/Prompt/PromptEntry';
import { useEntry } from './useEntry';

const MassiveEntry = () => {
  const [entryDate, setEntryDate] = useState('1970-01-01');
  const { entry, handleSubmit, handleComplete } = useEntry();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(entryDate);
  };

  return (
    <>
      <div className='massive-container-div'>
        <p>MASSIVE</p>

        <form onSubmit={handleFormSubmit}>
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
        {/* {error && <p className='error-class'>{error}</p>} */}
        {/* {entryPrompt && (<PromptEntry inputDate={entryDate} />)} */}

        {/* Display routines */}
        <div className='massive-routines-div'>
          {entry && entry.routines.length > 0 ? (
            entry.routines.map((r) => (
              <Routine
                {...r}
                key={r.id}
                onComplete={() => handleComplete(entryDate, r.id)}
              />
            ))
          ) : (
            <p>No routines on the entry for {entryDate}</p>
          )}
        </div>

        {/* unnecessary temp button */}
        <div className='unnecessary'>
          <button onClick={() => console.log('unused')}>temp</button>
          <p>{entryDate === '1970-01-01' ? '' : entryDate}</p>
          {/* <p>{error}</p> */}
        </div>

        {/* end unnecessary temp */}
      </div>
    </>
  );
};

/**
 * * Routines Component Note * *
 *
 * this component needs to:
 * * received the data (fetched using date from input)
 * * display the entry's routines and be able to modify their state
 *
 * (separate the following into a second component...)
 * * be able to add a routine via form with a submit to:
 * * * add the new routine to current entry's routines
 * * * adds the new routine to the list db, creating a new entry (or modifying one associated with current day) so that the next day's entry will include it when creating a new entry and fetching routines
 */
export default MassiveEntry;
