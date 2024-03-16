// css

export interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}

const ExampleRoutine = ({
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

export default ExampleRoutine;
