import { HabitProps } from './class/createHabit';

const Habit = ({ id, name, complete, onComplete }: HabitProps) => {
  const handleToggle = () => {
    onComplete?.(id);
  };

  return (
    <div>
      <h3>
        <input
          type='checkbox'
          id={id}
          checked={complete}
          onChange={handleToggle}
        />
        {name}
      </h3>
    </div>
  );
};

export default Habit;
