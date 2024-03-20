import { useState, useEffect } from 'react';
import Form from './Form';
import Routine from './Routine';
import { RoutineProps } from './createRoutine';

const Display = () => {
  const [routines, setRoutines] = useState<RoutineProps[]>([]);

  const handleComplete = (id: string) => {
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
                timstamp: 0,
              };
        }
        return routine;
      })
    );
  };

  useEffect(() => {
    requestRoutines();
  }, []);

  async function requestRoutines() {
    try {
      // TODO: this is improperly formatted
      const res = await fetch('http://localhost:3001/entry');
      if (!res.ok) {
        throw new Error('Network response error.');
      }

      const saved = await res.json();
      setRoutines(saved);
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
    }
  }

  return (
    <div>
      <h3>Routines</h3>
      <Form onNewRoutineAdd={requestRoutines} />

      <ul>
        {routines.length > 0 ? (
          routines.map((routine) => (
            <li
              key={routine.id}
              className={'routine'}
            >
              <Routine
                id={routine.id}
                name={routine.name}
                complete={routine.complete}
                timestamp={routine.timestamp}
                onComplete={handleComplete}
              />
            </li>
          ))
        ) : (
          <p>all routines are complete!</p>
        )}
      </ul>
    </div>
  );
};

export default Display;

/**
 * Full Routine App:
 * [ mm / dd / yyyy ] <button>fetch data for date</button>
 *
 * 1. display routines
 * 2. display routines
 * 3. display routines
 *
 * <button>add a new routine to list</button>
 *
 */
