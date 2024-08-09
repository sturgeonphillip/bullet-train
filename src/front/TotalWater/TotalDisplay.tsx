import { useState } from 'react';
import Bottle from './TotalBottle';

const TotalDisplay = () => {
  const [ounces, setOunces] = useState(0);

  return (
    <>
      <p>Total!</p>
      <Bottle
        color={'blue'}
        ounces={ounces}
        setOunces={setOunces}
        commitValue={
          // function to commit a value
        }
      />
    </>
  );
};

export default TotalDisplay;
