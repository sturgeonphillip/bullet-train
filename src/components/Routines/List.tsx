import { useState, useEffect } from 'react';
import Form from './Form';
import RoutineComponent from './Routine';
import { RoutineProps } from './createRoutine';

const List = () => {
  const [routines, setRoutines] = useState<RoutineProps[]>([]);

  // handlers
  const handleAddRoutine = (newRoutine: RoutineProps) => {
    /**
     * adds a routine to list of routines that will be done daily
     */
    setRoutines([...routines, newRoutine]);
  };

  const handleComplete = (id: string) => {
    const updatedRoutines = routines.map((r) =>
      r.id === id
        ? r.complete === false
          ? { ...r, complete: true, timestamp: Date.now() }
          : { ...r, complete: false, timestamp: 0 }
        : r
    );

    setRoutines(updatedRoutines);
  };

  // get ongoing list of routines
  useEffect(() => {
    fetch('http://localhost:3001/routineList')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response error.');
        }
        return res.json();
      })
      .then((saved) => setRoutines(saved))
      .catch((err) => {
        console.error(`There was a problem with the fetch operation: ${err}`);
      });
  }, []);

  return (
    <>
      <div>
        <Form onAdd={handleAddRoutine} />
        <ul>
          {routines.length > 0 ? (
            routines.map((routine) => (
              <li key={routine.id}>
                <RoutineComponent
                  id={routine.id}
                  name={routine.name}
                  complete={routine.complete}
                  timestamp={routine.timestamp}
                  onComplete={handleComplete}
                />
              </li>
            ))
          ) : (
            <p>you finished all of today's routines</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default List;
