import { useState } from 'react';
import './indexM.css';
import Routine from './RoutinesM/RoutineM';
import PromptEntry from './PromptM/PromptEntry';
import PromptList from './PromptM/PromptList';
import useEntry from './useEntry';
import { isoDateKey } from '../../utils/dateKey';

const MassiveEntry = () => {
  const today = isoDateKey();
  const [entryDate, setEntryDate] = useState(today);
  const {
    entry,
    showEntryPrompt,
    handleEntryPrompt,
    handleSubmit,
    handleComplete,
    // dataError,
    showListPrompt,
    handleListPrompt,
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
        {showEntryPrompt && (
          <PromptEntry
            inputDate={entryDate}
            handler={handleEntryPrompt}
          />
        )}
        {showListPrompt && <PromptList handler={handleListPrompt} />}

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
