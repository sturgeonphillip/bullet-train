import { useState, useCallback } from 'react';
// TODO: index file in the utils folder to cut down import lines
import { isoDateKey } from '../../utils/dateKey';
import { debounce } from '../../utils/debounce';
import './kerosene.css';
import WaterBottle from './WaterBottle';

const Display = () => {
  const [ounces, setOunces] = useState([0]);

  const today = isoDateKey();

  const debouncedHandleCommitValueData = debounce((value: number[]) => {
    console.log('Committing value data during fetch:', value);
    /** put fetch call here */
  }, 2000);

  const handleCommitValueData = useCallback(debouncedHandleCommitValueData, [
    debouncedHandleCommitValueData,
  ]);

  return (
    <>
      <div className='bottle-display-grid'>
        <WaterBottle
          color='red'
          ounces={ounces}
          setOunces={setOunces}
          commitValue={handleCommitValueData}
        />
      </div>
      <div>
        {/* add an empty bottle to the metrics for the day */}
        <button>add an empty bottle to {today}</button>
      </div>
    </>
  );
};

export default Display;
