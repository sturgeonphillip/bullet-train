import { RoutineProps } from '../createEntryM';

const Routine = ({
  id,
  name,
  complete,
  // timestamp,
  onComplete,
}: RoutineProps) => {
  function handleToggle() {
    if (onComplete) {
      onComplete(id);
    }
  }

  return (
    <>
      <li
        className='entry-routine-li'
        key={id}
      >
        <div
          id={id}
          className='routine-container-div'
        >
          <input
            type='checkbox'
            id={id}
            checked={complete}
            onChange={handleToggle}
            className='routine-checkbox'
          />
          <p>{name}</p>
        </div>
      </li>
    </>
  );
};

export default Routine;
