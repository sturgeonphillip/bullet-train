import { useState } from 'react';
import { Bottle } from './Bottle';
import './water.css';

const Display = () => {
  const [blueOunces, setBlueOunces] = useState([0]);
  const [redOunces, setRedOunces] = useState([0]);
  const [yellowOunces, setYellowOunces] = useState([0]);
  const [greenOunces, setGreenOunces] = useState([0]);

  const totalOunces =
    blueOunces[0] + redOunces[0] + yellowOunces[0] + greenOunces[0];

  // const check = document.activeElement;
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
            id={'red'}
            ounces={redOunces}
            setOunces={setRedOunces}
          />
          <Bottle
            id={'yellow'}
            ounces={yellowOunces}
            setOunces={setYellowOunces}
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
