import { useState } from 'react';
import { Bottle } from './Bottle';
import './water.css';

const Display = () => {
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
            id={'blue'}
            ounces={blueOunces}
            setOunces={setBlueOunces}
          />
          <Bottle
            id={'pink'}
            ounces={pinkOunces}
            setOunces={setPinkOunces}
          />
          <Bottle
            id={'orange'}
            ounces={orangeOunces}
            setOunces={setOrangeOunces}
          />
          <Bottle
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
