import './index.css';
import { RoutineProps } from './createRoutine';

const Routine = ({
  id,
  name,
  complete,
  timestamp,
  onComplete,
}: RoutineProps) => {
  const handleToggle = () => {
    if (onComplete) {
      onComplete(id);
    }
  };

  return (
    <>
      <div
        id={id}
        className='routine-container-div'
      >
        <p>{name}</p>
        <input
          type='checkbox'
          id={id}
          checked={complete}
          onChange={handleToggle}
        />
        <p>{timestamp > 0 ? timestamp : 0}</p>
      </div>
    </>
  );
};

export default Routine;
