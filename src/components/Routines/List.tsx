import Form from './Form';
import RoutineComponent from './Routine';
import { RoutineProps } from '../../class/Routine/createRoutine';
import Routine from '../../class/Routine/Routine';
import { useState } from 'react';

const List = () => {
  // const myRoutine = new Routine(date, daily);

  // const routines = new Routine(Date.now(), []);

  Routine;

  const [routines, setRoutines] = useState<RoutineProps[]>([]);

  // const routineList = routines.getRoutines();

  const handleAddRoutine = (newRoutine: RoutineProps) =>
    setRoutines([...routines, newRoutine]);

  const handleComplete = (id: string) => {
    // routines.setRoutines(id);
    const updatedRoutines = routines.map((r) =>
      r.id === id ? { ...r, complete: true } : r
    );

    setRoutines(updatedRoutines);
  };

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
