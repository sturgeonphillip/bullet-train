import { useState, useEffect } from 'react';
import Form from './Form';
import Habit from './Habit';
// import { HabitProps } from './class/createHabit';
import Habits from './class/DailyHabits';

const List = () => {
  const daily = ['row', 'pray', 'apply', 'code'];
  const [date, setDate] = useState(new Date());

  // const dtOptions = {
  //   // weekday: 'short',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  //   // hour: 'numeric',
  //   // minute: 'numeric',
  //   // second: 'numeric',
  // };

  // const dtFormat = new Intl.DateTimeFormat('en-US', dtOptions);

  const myRoutine = new Habits(date, daily);

  const [habits, setHabits] = useState(myRoutine.getHabits());
  useEffect(() => {
    setInterval(() => setDate(new Date()), 86400000);
  }, [date]);

  // check off when completed
  const handleComplete = (id) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              finished: Date.now(),
              complete: true,
            }
          : habit
      )
    );
  };

  // console.log(myRoutine);

  // console.log(habits['habits']);
  // // fetch habits and set as state
  // useEffect(() => {
  //   fetch('http://localhost:3001/habits')
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error('Network response error.');
  //       }
  //       return res.json();
  //     })
  //     .then((saved) => setHabits(saved))
  //     .catch((err) => {
  //       console.error(`There was a problem with the fetch operation: ${err}`);
  //     });
  // }, []);

  // console.log(habits);
  return (
    <>
      <div>
        <h3>{dtFormat.format(date)}</h3>
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
                  // finished={habit.finished}
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
