import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { HydrationBottle } from './HydrationBottle';
import { debouncePatchBottle } from './debouncer/patchBottle';
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

export const HydrationTracker = () => {
  const [bottles, setBottles] = useState<BottleStateProps[]>(
    Array.from({ length: 4 }, createBottle)
  );

  const updateBottle = (index: number, newOunces: number) => {
    setBottles((prev) => {
      const updated = [...prev];
      const b = updated[index];
      const next = {
        ...b,
        ounces: newOunces,
        complete: newOunces === b.capacity,
      };
      updated[index] = next;
      debouncePatchBottle(todayKey, next);
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
