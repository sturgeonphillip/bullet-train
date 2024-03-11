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
    fetch('http://localhost:3001/routines')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response error.');
        }
        return res.json();
      })
      .then((saved) => setRoutines(saved))
      .catch((err) => {
        console.log(`There was a problem with the fetch operation: ${err}`);
      });
  }, []);

  return (
    <div>
      <h3>Routines</h3>
      <Form />
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
