import { RoutineProps } from './types';

export const Routine = ({ id, name, complete, onComplete }: RoutineProps) => {
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
        <input
          type='checkbox'
          id={id}
          checked={complete}
          onChange={handleToggle}
          className='routine-checkbox'
        />
        <p className='routine-name-p'>{name}</p>
      </li>
    </>
  );
};
