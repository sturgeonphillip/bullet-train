import { useState, useEffect, useCallback } from 'react';
import { RoutineProps } from './createRoutine';

export const useRoutines = (entryDate: string) => {
  const [routines, setRoutines] = useState<RoutineProps[]>([]);

  const requestRoutines = useCallback(async () => {
    if (!entryDate) {
      console.error(`entryDate is undefined.`);
      return; // exit if invalid argument
    }
    try {
      const res = await fetch(`http://localhost:3001/entry/${entryDate}`);

      console.log('dogs', entryDate, res);
      if (!res.ok) {
        throw new Error('Network response error with requestRoutines.');
      }

      const data = await res.json();
      setRoutines(data);
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
    }
  }, [entryDate, setRoutines]);

  useEffect(() => {
    requestRoutines();
  }, [requestRoutines]);

  const handleComplete = (id: string) => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id === id) {
          return routine.complete === false
            ? {
                ...routine,
                complete: true,
                timestamp: Date.now(), // TODO set with the appropriate format
              }
            : {
                ...routine,
                complete: false,
                timestamp: 0,
              };
        }
        return routine;
      })
    );
  };

  return { routines, handleComplete };
};
