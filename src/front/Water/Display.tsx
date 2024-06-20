import { useState } from 'react';
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

  const totalOunces = [
    blueOunces,
    pinkOunces,
    orangeOunces,
    greenOunces,
  ].reduce((acc, crv) => {
    return (acc += crv[0]);
  }, 0);

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
