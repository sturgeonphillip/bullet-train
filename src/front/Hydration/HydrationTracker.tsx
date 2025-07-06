import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { HydrationBottle } from './HydrationBottle';
import { debouncePatchTotalOunces } from './debouncer/patchTotalOunces';
import './hydration.css';

export interface BottleStateProps {
  id: string;
  ounces: number;
  capacity: number;
  complete: boolean;
}

export interface DayLogProps {
  dateKey: string;
  bottles: BottleStateProps[];
  totalOunces: number;
}

const createBottle = (): BottleStateProps => ({
  id: uuid(),
  ounces: 0,
  capacity: 32,
  complete: false,
});

const todayKey = new Date().toISOString().split('T')[0];

function fillBottlesSequentially(
  total: number,
  bottleCount = 4,
  capacity = 32
) {
  const ounces = [];
  let remaining = total;

  for (let i = 0; i < bottleCount; i++) {
    const fill = Math.min(Math.floor(remaining / 4) * 4, capacity);
    ounces.push(fill);
    remaining -= fill;
  }

  return ounces;
}

// export function fillBottlesSequentiallyB(
//   total: number,
//   bottleCount = 4
// ): BottleStateProps[] {
//   const bottles: BottleStateProps[] = [];

//   for (let i = 0; i < bottleCount; i++) {
//     const oz = Math.min(total, 32);
//     bottles.push({
//       id: uuid(),
//       ounces: oz,
//       capacity: 32,
//       complete: oz === 32,
//     });

//     total -= oz;
//   }

//   return bottles;
// }

export const HydrationTracker = () => {
  const [bottles, setBottles] = useState<BottleStateProps[]>(
    Array.from({ length: 4 }, createBottle)
  );

  // useEffect(() => {
  //   const loadSavedBottles = async () => {
  //     const res = await fetch(`/api/hydration/$todayKey}`);

  //     if (!res.ok) return;
  //     const data = await res.json();
  //     setBottles(data.bottles);
  //   };

  //   loadSavedBottles();
  // }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://localhost:3001/hydration/${todayKey}`);
      const data = await res.json();

      const total = data.totalOunces;

      const splitBottles = fillBottlesSequentially(total, 4);

      setBottles(splitBottles());

      //   const { totalOunces } = await res.json();
      //   const ouncesPerBottle = totalOunces / 4;

      //   setBottles(
      //     Array.from({ length: 4 }, () => ({
      //       id: uuid(),
      //       ounces: ouncesPerBottle,
      //       capacity: 32,
      //       complete: ouncesPerBottle === 32,
      //     }))
      //   );
    };

    load();
  }, []);

  /**
   * backend should return something like:
   * {
   *  "dateKey": "2025-07-03",
   *  "totalOunces": 60
   * }
   *
   */

  // const updateBottle = (index: number, newOunces: number) => {
  //   setBottles((prev) => {
  //     const updated = [...prev];
  //     updated[index] = {
  //       ...updated[index],
  //       ounces: newOunces,
  //       complete: newOunces === updated[index].capacity,
  //     };
  //     const next = {
  //       ...b,
  //       ounces: newOunces,
  //       complete: newOunces === b.capacity,
  //     };
  //     updated[index] = next;
  //     debouncePatchBottle(todayKey, next);
  //     return updated;
  //   });
  // };

  const updateBottle = (index: number, newOunces: number) => {
    setBottles((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        ounces: newOunces,
        complete: newOunces === updated[index].capacity,
      };

      const newTotal = updated.reduce((sum, b) => sum + b.ounces, 0);
      debouncePatchTotalOunces(todayKey, newTotal);
      return updated;
    });
  };

  const totalOunces = bottles.reduce((sum, b) => sum + b.ounces, 0);

  return (
    <div className='hydration-tracker'>
      {bottles.map((bottle, i) => (
        <HydrationBottle
          key={bottle.id}
          index={i}
          ounces={bottle.ounces}
          onChange={(v: number) => updateBottle(i, v)}
        />
      ))}
      <p className='hydration-total'>Total: {totalOunces} oz</p>
    </div>
  );
};
