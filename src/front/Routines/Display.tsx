import Routine from './Routine';
import { RoutineProps } from './createRoutine';

interface RoutineDisplayProps {
  routines: RoutineProps[];
  handleComplete: (id: string) => void;
}

const Display = ({ routines, handleComplete }: RoutineDisplayProps) => {
  console.log('DISPLAY COMPONENT ROUTINES', routines);

  return (
    <div>
      {routines.length > 0 ? (
        <ul>
          {routines.map((routine) => (
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
          ))}
        </ul>
      ) : (
        <p>all routines are complete, or you didn't add any.</p>
      )}
    </div>
  );
};

export default Display;
// <p>all routines are complete, or you didn't add any.</p>
