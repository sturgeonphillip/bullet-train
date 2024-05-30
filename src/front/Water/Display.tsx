import { useState } from 'react';
import { Bottle } from './Bottle';
import './water.css';

const Display = () => {
  console.log('WATER!');
  const [ounces, setOunces] = useState([0]);

  return (
    <>
      <Bottle
        ounces={ounces}
        setOunces={setOunces}
      />
    </>
  );
};

export default Display;
