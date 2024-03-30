import { useState } from 'react';
import './indexM.css';
import Routine from './RoutinesM/RoutineM';
import PromptEntry from '../Entries/Prompt/PromptEntry';
import useEntry from './useEntry';

const MassiveEntry = () => {
  const [entryDate, setEntryDate] = useState('');
  const {
    entry,
    showPrompt,
    handlePrompt,
    handleSubmit,
    handleComplete,
    // dataError,
  } = useEntry(entryDate);

  return (
    <>
      <div className='massive-container-div'>
        {/* <p>MASSIVE</p> */}

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
        {/* {dataError && <p className='error-className'>{dataError}</p>} */}
        {showPrompt && (
          <PromptEntry
            inputDate={entryDate}
            handler={handlePrompt}
          />
        )}

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
            <>
              <h4>Entry for {entryDate} is empty.</h4>
              <p>Add some routines.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MassiveEntry;
