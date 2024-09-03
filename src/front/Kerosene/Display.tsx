import { useState, useEffect, useCallback } from 'react';
import { debouncer } from './updatedDebouncer';
import WaterBottle from './UpdatedWaterBottleA';
import './kerosene.css';
import { WaterMetricsProps } from './createWaterLog';

const Display = () => {
  // initialize bottles as an array of arrays of number
  const [bottles, setBottles] = useState<number[][]>([[0], [0], [0], [0]]);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    fetchWaterData(date);
  }, [date]);

  const fetchWaterData = async (dateKey: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/updateKerosene/${dateKey}`
      );
      if (response.ok) {
        const data = await response.json();

        const fetchedBottles = data.metrics.map((metric: WaterMetricsProps) => [
          metric.ounces,
        ]);
        // update bottle state based on fetched data
        setBottles(fetchedBottles);
      } else {
        throw new Error('Failed to fetch water data.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleOuncesChange = (index: number, value: number[]) => {
    setBottles((prevBottles) => {
      const updatedBottles = [...prevBottles];
      updatedBottles[index] = value;
      return updatedBottles;
    });
  };

  const commitValue = async (index: number, value: number[]) => {
    console.log('INDEX', index, 'VALUE', value);
    try {
      const response = await fetch(
        `http://localhost:3001/updateKerosene/${date}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ index, value }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok (from UpdatedDisplayB).');
      }

      const data = await response.json();
      console.log('Fetch successful:', data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const debouncedCommitValue = useCallback(
    debouncer(
      (index: number, value: number[]) => commitValue(index, value),
      2000
    ),
    [date]
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  return (
    <>
      <div className={'bottle-display-grid'}>
        {bottles.map((ounces, index) => (
          <WaterBottle
            key={index}
            color={index % 2 === 0 ? 'blue' : 'pink'}
            ounces={ounces}
            onOuncesChange={(value) => handleOuncesChange(index, value)}
            onCommit={(value) => debouncedCommitValue(index, value)}
          />
        ))}
      </div>
      <button onClick={() => console.log('add an empty bottle')}>
        Add a Bottle! {bottles.length}
      </button>
      <div className={'date-selector'}>
        <input
          type='date'
          value={date}
          onChange={handleDateChange}
        />
        <button onClick={() => fetchWaterData(date)}>Submit</button>
      </div>
    </>
  );
};

export default Display;
