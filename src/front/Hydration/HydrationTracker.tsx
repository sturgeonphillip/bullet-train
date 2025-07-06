import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { HydrationBottle } from './HydrationBottle';
import { debouncePatchTotalOunces } from './debouncer/patchTotalOunces';
import './hydration.css';
import { getTodayKey } from '../../utils/dateUtils';

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

// TODO: fix to replace with import, centralize utils(?)
const todayKey = getTodayKey(); // uses PDT-local time

function fillBottlesSequentially(
  total: number,
  bottleCount = 4,
  capacity = 32
): BottleStateProps[] {
  const bottles: BottleStateProps[] = [];
  let remaining = total;

  for (let i = 0; i < bottleCount; i++) {
    const fill = Math.min(remaining, capacity);
    bottles.push({
      id: uuid(),
      ounces: fill,
      capacity,
      complete: fill === capacity,
    });

    remaining -= fill;
  }

  return bottles;
}

export const HydrationTracker = () => {
  const [bottles, setBottles] = useState<BottleStateProps[]>(
    Array.from({ length: 4 }, createBottle)
  );

  useEffect(() => {
    const loadHydrationData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/hydration/${todayKey}`);

        if (!res.ok) return;

        const data = await res.json();
        const splitBottles = fillBottlesSequentially(data.totalOunces, 4);

        setBottles(splitBottles);
      } catch (err) {
        console.error('Failed to load hydration data:', err);
      }
    };

    loadHydrationData();
  }, []);

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
