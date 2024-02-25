import { RoutineProps } from '../../class/Routine/createRoutine';

const Routine = ({
  id,
  name,
  complete,
  onComplete,
  timestamp,
}: RoutineProps) => {
  const handleToggle = () => onComplete?.(id);

  return (
    <div>
      <input
        type='checkbox'
        id={id}
        checked={complete}
        onChange={handleToggle}
      />
      <h3>{name}</h3>
      <p>{timestamp > 0 ? timestamp : ''}</p>
    </div>
  );
};

export default Routine;
