import { useState } from 'react';
import { Bottle, BottleProps } from './Bottle';
import './water.css';

const Display = () => {
  console.log('WATER!');
  const [blueOunces, setBlueOunces] = useState([0]);
  const [redOunces, setRedOunces] = useState([0]);
  const [yellowOunces, setYellowOunces] = useState([0]);
  const [greenOunces, setGreenOunces] = useState([0]);

  const totalOunces =
    blueOunces[0] + redOunces[0] + yellowOunces[0] + greenOunces[0];

  return (
    <>
      <h3>Water Total Ounces: {totalOunces}</h3>
      <div className='bottle-display-div'>
        <Bottle
          name={'blue'}
          ounces={blueOunces}
          setOunces={setBlueOunces}
        />
        <Bottle
          name={'red'}
          ounces={redOunces}
          setOunces={setRedOunces}
        />
        <Bottle
          name={'yellow'}
          ounces={yellowOunces}
          setOunces={setYellowOunces}
        />
        <Bottle
          name={'green'}
          ounces={greenOunces}
          setOunces={setGreenOunces}
        />
      </div>
    </>
  );
};

export default Display;
