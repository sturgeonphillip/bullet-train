import { useState, useEffect, useCallback } from 'react';
import WaterBottle from './WaterBottle';
import './kerosene.css';
import {
  BottleProps,
  createWaterBottle,
  WaterMetricsProps,
} from './createWaterLog';
import { getLocalDateKey } from '../../utils/dateKey';

const Display = () => {
  // initialize an array of function calls that each create a new bottle
  const [bottles, setBottles] = useState<BottleProps[]>([
    createWaterBottle(),
    createWaterBottle(),
    createWaterBottle(),
    createWaterBottle(),
  ]);

  const [date, setDate] = useState<string>(
    getLocalDateKey()
    // new Date().toISOString().slice(0, 10)
  );

  const fetchWaterData = useCallback(async (dateKey: string) => {
    try {
      const response = await fetch(`http://localhost:3001/kerosene/${dateKey}`);

      if (response.ok) {
        const data = await response.json();

        // if no metrics exist, create default data
        if (!data.metrics || data.metrics.length === 0) {
          // create default data (eg, 3 bottles w/ 0 oz)
          const defaultMetrics = [
            { ounces: 0 }, // createWaterBottle(),
            { ounces: 0 }, // createWaterBottle(),
            { ounces: 0 }, // createWaterBottle(),
            { ounces: 0 }, // createWaterBottle(),
          ];

          // send a request to create this default data
          await createDefaultData(dateKey, defaultMetrics);

          // after created, fetch again to update state
          await fetchWaterData(dateKey);

          // exit early after fetching again
          return;
        } else {
          const fetchedBottles = data.metrics.map(
            (metric: WaterMetricsProps) => [metric.ounces]
          );

          setBottles(fetchedBottles);
        }
      }
    } catch (err) {
      console.error(`Fetch error: ${err}`);
    }
  }, []);

  useEffect(() => {
    console.log('date', date);
    fetchWaterData(date);
  }, [date, fetchWaterData]);

  const createDefaultData = async (
    dateKey: string,
    metrics: { ounces: number }[]
  ) => {
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
    }
  };

  // const fetchWaterData = async (dateKey: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:3001/kerosene/${dateKey}`);

  //     if (response.ok) {
  //       const data = await response.json();

  //       // exit early and keep default state if no metrics exist
  //       if (!data.metrics || data.metrics.length === 0) {
  //         return;
  //       } else {
  //         const fetchedBottles = data.metrics.map(
  //           (metric: WaterMetricsProps) => [metric.ounces]
  //         );
  //         setBottles(fetchedBottles);
  //       }
  //     }
  //   } catch (err) {
  //     console.error(`Fetch error: ${err}`);
  //   }
  // };

  const handleOuncesChange = (index: number, value: number[]) => {
    setBottles((prevBottles) => {
      const updatedBottles = [...prevBottles];
      updatedBottles[index].ounces = value;
      return updatedBottles;
    });
  };

  const debouncedCV = useCallback(
    (index: number, value: number[]) => {
      let timeout: NodeJS.Timeout | null = null;

      return () => {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(async () => {
          try {
            const res = await fetch(`http://localhost:3001/kerosene/${date}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ index, value }),
            });

            if (!res.ok) {
              throw new Error('Network response was not ok.');
            }

            const data = await res.json();
            console.log('Fetch successful:', data);
          } catch (err) {
            console.error('Fetch error:', err);
          }
        }, 2000);
      };
    },
    [date]
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  return (
    <>
      <div className={'bottle-display-grid'}>
        {bottles.map((bottle, index) => (
          <WaterBottle
            key={index}
            color={index % 2 === 0 ? 'blue' : 'pink'}
            ounces={bottle.ounces}
            onOuncesChange={(value) => handleOuncesChange(index, value)}
            onCommit={(value) => debouncedCV(index, value)}
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

/**
 * Key Points and Improvements related to Display.tsx
 *
 * 1. Default Metrics Creation: Creating an array of default metrics with four bottles is good. However, to make it more dynamic, consider defining the number of bottles as a constant or state variable.
 *
 * 2. Commented Code: Some commented-out code is unnecessary. It's good practice to remove unused code to keep your codebase clean.
 *
 * 3. Error Handling: Provide user feedback when an error occurs during fetch or creating data. This could be done using a state variable to show an error message in the UI.
 *
 * 4. Initial State: Right now, `bottles` is initialized with four bottles of zero ounces. To ensure that this is only the case when there is no data, consider setting the initial state to an empty array and then populate it based on the fetched data.
 *
 * 5. Avoiding Duplicate Fetch Calls: When creating default data and then immediately fetching it again, ensure that the state is updated correctly without the unnecessary re-renders.
 *
 */
