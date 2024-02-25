import { useState } from 'react';
import { createHabit } from './class/createHabit'; // class or component folder?

const Form = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const habit = createHabit(name);

    if (habit.name.length < 3) {
      return alert('Add a habit to your submission.');
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habit),
    };

    try {
      const response = await fetch('http://localhost:3001/habits', options);
      if (!response.ok) {
        throw new Error('Network response is not OK.');
      }
    } catch (err) {
      console.error('Caught Error:', err);
    }

    console.log('Submitting habit:', habit);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type='submit'>Add</button>
    </form>
  );
};

export default Form;
