import { useState } from 'react';
import { Bottle } from './Bottle';
import './water.css';
import { isoDateKey } from '../../utils/dateKey';
import { DebounceFetchProps, debounceTotalOz } from './debounceTotalOz';

const Display = () => {
  const currentDateKey = isoDateKey();
  const [blueOunces, setBlueOunces] = useState([0]);
  const [pinkOunces, setPinkOunces] = useState([0]);
  const [orangeOunces, setOrangeOunces] = useState([0]);
  const [greenOunces, setGreenOunces] = useState([0]);

  // const [totalOz, setTotalOz] = useState<number>(0);

  const totalOunces = [
    blueOunces,
    pinkOunces,
    orangeOunces,
    greenOunces,
  ].reduce((acc, crv) => {
    return (acc += crv[0]);
  }, 0);

  let timeoutId: NodeJS.Timeout | null;
  let abortController: AbortController;

  const handleSliderCommit = () => {
    const debouncedValues: DebounceFetchProps = {
      timeout: timeoutId,
      abort: abortController,
      value: totalOunces,
      dateKey: currentDateKey,
    };

    debounceTotalOz(debouncedValues);
  };
  return (
    <>
      <div className='bottle-display-div'>
        <div className='bottle-group-div'>
          <Bottle
            // id={`${currentDateKey}-blue`}
            // dateKey={currentDateKey}
            color={'blue'}
            ounces={blueOunces}
            setOunces={setBlueOunces}
            commitValue={handleSliderCommit}
          />
          <Bottle
            // id={`${currentDateKey}-pink`}
            // dateKey={currentDateKey}
            color={'pink'}
            ounces={pinkOunces}
            setOunces={setPinkOunces}
            commitValue={handleSliderCommit}
          />
          <Bottle
            // id={`${currentDateKey}-orange`}
            // dateKey={currentDateKey}
            color={'orange'}
            ounces={orangeOunces}
            setOunces={setOrangeOunces}
            commitValue={handleSliderCommit}
          />
          <Bottle
            // id={`${currentDateKey}-green`}
            // dateKey={currentDateKey}
            color={'green'}
            ounces={greenOunces}
            setOunces={setGreenOunces}
            commitValue={handleSliderCommit}
          />
        </div>
        <h3>Total Ounces: {totalOunces}</h3>
      </div>
    </>
  );
};

export default Display;
