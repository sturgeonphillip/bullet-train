import { HabitProps } from './class/createHabit';

const Habit = ({ id, name, complete }: HabitProps) => {
  const handleToggle = () => {
    onComplete(id, finished);
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
