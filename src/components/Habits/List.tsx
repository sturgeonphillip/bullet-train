import { useState, useEffect } from 'react';
import Form from './Form';
// import Habit component
import { HabitProps } from './class/createHabit';

const List = () => {
  const [habits, setHabits] = useState<HabitProps[]>([]);

  // check off when completed
  const handleComplete = (id) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              finished: Date.now(),
              complete: !errand.complete,
            }
          : habit
      )
    );
  };

  // fetch habits and set as state
  useEffect(() => {
    fetch('http://localhost:3001/habits')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response error.');
        }
        return res.json();
      })
      .then((saved) => setHabits(saved))
      .catch((err) => {
        console.error(`There was a problem with the fetch operation: ${err}`);
      });
  }, []);

  const datePlaceholder = 'Habits for ${date}';
  return (
    <>
      <div>
        <h3>{datePlaceholder}</h3>
        <Form />
        <ul>
          {habits.length > 0 ? (
            habits.map((habit) => (
              <li key={habit.id}>
                <Habit
                  id={habit.id}
                  name={habit.name}
                  complete={habit.complete}
                  onComplete={handleComplete}
                  finished={habit.finished}
                />
              </li>
            ))
          ) : (
            <p>you executed all your daily habits!</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default List;
