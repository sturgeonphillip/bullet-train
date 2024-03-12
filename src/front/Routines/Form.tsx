import { useState } from 'react';
import { createRoutine } from './createRoutine';

interface FormProps {
  onNewRoutineAdd: () => void;
}

const Form = ({ onNewRoutineAdd }: FormProps) => {
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const routine = createRoutine(name);

    if (routine.name.length < 2) {
      return alert('Add a routine to your submission.');
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routine),
    };

    try {
      const response = await fetch('http://localhost:3001/list', options);

      if (!response.ok) {
        throw new Error('Network response is not ok.');
      }
    } catch (err) {
      console.error('Caught Error:', err);
    }

    onNewRoutineAdd();
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name='routine-form'
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type='submit'>Add</button>
    </form>
  );
};

export default Form;
