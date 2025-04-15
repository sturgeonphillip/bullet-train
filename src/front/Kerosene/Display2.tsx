import { useState, useEffect, useCallback } from 'react';
import { debouncer } from './updatedDebouncer';
import WaterBottle from './WaterBottle';
import './kerosene.css';
import { WaterMetricsProps } from './createWaterLog';

const Display = () => {
  const [bottles, setBottles] = useState<number[][]>([]);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [error, setError] = useState<string | null>(null); // for error handling

  const createDefaultData = useCallback(
    async (dateKey: string, metrics: { ounces: number }[]) => {
      try {
        const response = await fetch(
          `http://localhost:3001/kerosene/${dateKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ metrics }),
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        console.log('Default data created:', data);
      } catch (err) {
        console.error('Error creating default data:', err);
        setError('Failed to create default data. Please try again.'); // set error message
      }
    },
    []
  );

  const fetchWaterData = useCallback(
    async (dateKey: string) => {
      try {
        const response = await fetch(
          `http://localhost:3001/kerosene/${dateKey}`
        );

        console.log('RESPONSE:', response);
        if (response.ok) {
          const data = await response.json();

          // if no metrics exist, create default data
          if (!data.metrics || data.metrics.length === 0) {
            const defaultMetrics = Array(4).fill({ ounces: 0 }); // create 4 bottles with 0 oz
            await createDefaultData(dateKey, defaultMetrics);
            await fetchWaterData(dateKey); // fetch again to update state
            return; // exit early after fetching again
          } else {
            const fetchedBottles = data.metrics.map(
              (metric: WaterMetricsProps) => [metric.ounces]
            );

            setBottles(fetchedBottles);
          }
        } else {
          throw new Error('Failed to fetch data.');
        }
      } catch (err) {
        console.error(`Fetch error: ${err}`);
        // set error message
        setError('Failed to load data. Please try again.');
      }
    },
    [createDefaultData]
  );

  const handleOuncesChange = (index: number, value: number[]) => {
    setBottles((prevBottles) => {
      const updatedBottles = [...prevBottles];
      updatedBottles[index] = value;
      return updatedBottles;
    });
  };

  const commitValue = useCallback(
    async (index: number, value: number[]) => {
      console.log('INDEX', index, 'VALUE', value);

      try {
        const response = await fetch(`http://localhost:3001/kerosene/${date}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ index, value }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data = await response.json();

        console.log('Fetch successful:', data);
      } catch (err) {
        console.error(`Fetch error: ${err}`);
        setError('Failed to update data. Please try again.'); // set error message
      }
    },
    [date]
  );

  const debouncedCommitValue = useCallback(
    (index: number, value: number[]) => {
      debouncer(async () => {
        await commitValue(index, value);
      }, 500)();
    },
    [commitValue]
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    console.log('date:', date);
    fetchWaterData(date);
  }, [date, fetchWaterData]);

  return (
    <>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
        Add a bottle. Current Bottles {bottles.length}
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
