import { useState } from 'react';
import { RoutineProps, createRoutine } from './createRoutine';

interface FormProps {
  onAdd: (routine: RoutineProps) => void;
}

const Form = ({ onAdd }: FormProps) => {
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const routine = createRoutine(name);

    if (routine.name.length < 1) {
      return alert('Cannot add a routine without a name.');
    }
    onAdd(routine);
    setName('');

    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(routine),
    // };

    // try {
    //   const response = await fetch('http://localhost:3001/routines', options);
    //   if (!response.ok) {
    //     throw new Error('Network response is not ok.');
    //   }
    // } catch (err) {
    //   console.error('Caught Error:', err);
    // }

    console.log('Submitting routine:', routine);
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
