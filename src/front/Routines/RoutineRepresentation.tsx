// rewrite of Routine.tsx, comparison without timestamp
export interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}

export const RoutineRepresentation = ({
  id,
  name,
  complete,
  onComplete,
}: RoutineProps) => {
  function handleToggle() {
    if (onComplete) {
      onComplete(id);
    }
  }

  return (
    <>
      <div className='routine-container-div'>
        <span className='routine-container-div'>
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
        </span>
      </div>
    </>
  );
};
