import { useState, useCallback } from 'react';
import { debouncer } from './updatedDebouncer';
import WaterBottle from './UpdatedWaterBottle';
import './kerosene.css';

const Display = () => {
  const [bottles, setBottles] = useState<number[][]>([[0], [0], [0], [0]]);

  // update state for specific bottle by index
  const handleOuncesChange = (index: number, value: number[]) => {
    setBottles((prevBottles) => {
      const updatedBottles = [...prevBottles];
      updatedBottles[index] = value;
      return updatedBottles;
    });
  };

  // define async function to debounce
  const commitValue = async (index: number, value: number[]) => {
    try {
      console.log('Committing value data:', value);
      // const response = await fetch(`http://localhost:3001/water/${dateKey}`, {
      const response = await fetch(
        `http://localhost:3001/kerosene/2024-08-29, {`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ index, value }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      console.log('Fetch successful:', data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  // debounce the commit function
  const debouncedCommitValue = useCallback(
    debouncer(
      (index: number, value: number[]) => commitValue(index, value),
      2000
    ),
    [] // empty deps because commitValue is stable
  );
  /**
 * debouncer(
      (index: number, value: number[]) => commitValue(index, value), 2000
 */

  // break

  // const handleCommit = useCallback(
  //   debouncer(async (index: number, value: number[]) => {
  //     try {
  //       console.log('Committing value data:', value);
  //       const response = await fetch('/endpoint', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ index, value }),
  //       });

  //       if (!response.ok) {
  //         throw new Error('Network response was not ok.');
  //       }

  //       const data = await response.json();
  //       console.log('Fetch successful:', data);
  //     } catch (err) {
  //       console.error('Fetch error:', err);
  //     }
  //   }, 2000),
  //   []
  // );

  return (
    <>
      <div className={'bottle-display-grid'}>
        {bottles.map((ounces, index) => (
          <WaterBottle
            key={index}
            color={index % 2 === 0 ? 'green' : 'blue'}
            ounces={ounces}
            onOuncesChange={(value) => handleOuncesChange(index, value)}
            onCommit={(value) => debouncedCommitValue(index, value)}
          />
        ))}
      </div>
      <button onClick={() => console.log('add an empty bottle')}>
        Add a Bottle!
      </button>
    </>
  );
};

export default Display;
