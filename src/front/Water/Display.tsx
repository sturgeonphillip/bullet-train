import { useState, useEffect } from 'react';
import { Bottle } from './Bottle';
import { Bottle2 } from './Bottle2';
import './water.css';
import { isoDateKey } from '../../utils/dateKey';

const Display = () => {
  const currentDateKey = isoDateKey();
  const [blueOunces, setBlueOunces] = useState([0]);
  const [pinkOunces, setPinkOunces] = useState([0]);
  const [orangeOunces, setOrangeOunces] = useState([0]);
  const [greenOunces, setGreenOunces] = useState([0]);

  const [totalOz, setTotalOz] = useState(0);

  const totalOunces = [
    blueOunces,
    pinkOunces,
    orangeOunces,
    greenOunces,
  ].reduce((acc, crv) => {
    return (acc += crv[0]);
  }, 0);

  // debounce logic
  let debounceTimer: NodeJS.Timeout | null = null;

  const debounceFetch = (value: number) => {
    clearTimeout(debounceTimer as NodeJS.Timeout);

    debounceTimer = setTimeout(() => {
      // perform fetch request
      console.log(`Fetch request with totalOz: ${totalOz}`);

      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blueOunces,
          pinkOunces,
          orangeOunces,
          greenOunces,
          totalOunces,
        }),
      };

      (async () => {
        await fetch(`http://localhost:3001/water/${dateKey}`, options);
      })();
      console.log(
        'added to the db!',
        JSON.stringify({
          blueOunces,
          pinkOunces,
          orangeOunces,
          greenOunces,
          totalOunces,
        })
      );
    }, 1500);
  };

  const handleSliderChange = (newValue: number) => {
    setOunces([newValue]);

    debounceFetch(newValue);
  };

  // end new logic

  return (
    <>
      <div className='bottle-display-div'>
        <div className='bottle-group-div'>
          <Bottle
            dateKey={currentDateKey}
            id={'blue'}
            ounces={blueOunces}
            setOunces={setBlueOunces}
          />
          <Bottle
            dateKey={currentDateKey}
            id={'pink'}
            ounces={pinkOunces}
            setOunces={setPinkOunces}
          />
          {/* <Bottle
            dateKey={currentDateKey}
            id={'orange'}
            ounces={orangeOunces}
            setOunces={setOrangeOunces}
          />
          <Bottle
          dateKey={currentDateKey}  
          id={'green'}
            ounces={greenOunces}
            setOunces={setGreenOunces}
          /> */}

          <Bottle2
            dateKey={currentDateKey}
            id={'orange'}
            ounces={orangeOunces}
            setOunces={setOrangeOunces}
          />
          <Bottle2
            dateKey={currentDateKey}
            id={'green'}
            ounces={greenOunces}
            setOunces={setGreenOunces}
          />
        </div>
        <h3>Total Ounces: {totalOunces}</h3>
      </div>
    </>
  );
};

export default Display;
