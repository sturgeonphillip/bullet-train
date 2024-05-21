import { useState, useCallback } from 'react';
import { RoutineProps } from './createEntryM';

export const useRoutines = () => {
  const [routines, setRoutines] = useState<RoutineProps[]>([]);

  const fetchRoutines = useCallback(async (entryDate: string) => {
    if (!entryDate) {
      console.error(`entryDate is undefined.`);
      return; // exit if invalid argument
    }
    try {
      const res = await fetch(`http://localhost:3001/entry/${entryDate}`);

      if (!res.ok) {
        throw new Error(
          'RESPONSE NOT OK. Network response error with fetchRoutines.'
        );
      }
      const data = await res.json();

      setRoutines(data.routines);
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
    }
  }, []);

  const handleSubmit = async (entryDate: string) => {
    await fetchRoutines(entryDate);
  };

  const handleComplete = async (id: string) => {
    // update local state
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id === id) {
          return routine.complete === false
            ? {
                ...routine,
                complete: true,
                timestamp: Date.now(),
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

    // update routine in database
    try {
      const updatedRoutine = routines.find((routine) => routine.id === id);
      if (!updatedRoutine) {
        console.error(`Routine with id ${id} not found.`);
        return;
      }

      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // ...restOfTheEntry,
          routines: [updatedRoutine],
        }),
      };

      const res = await fetch(
        `http://localhost:3001/entry/${entryDate}`,
        options
      );

      if (!res.ok) {
        throw new Error('Failed to pdate the routine in the database.');
      }

      console.log('Routine updated successfully.');
    } catch (err) {
      console.error(`Error updating the routine: ${err}`);
    }
  };

  return { routines, handleSubmit, handleComplete };
};
