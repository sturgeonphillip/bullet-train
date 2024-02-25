import { useState } from 'react';
import { createErrand } from './createErrand';

const Form = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errand = createErrand(name);

    if (errand.name.length < 3) {
      return alert('Add an errand to your submission.');
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errand),
    };

    try {
      const response = await fetch('http://localhost:3001/errands', options);
      if (!response.ok) {
        throw new Error('Network response is not ok.');
      }
    } catch (err) {
      console.error('Caught Error: ', err);
    }
    console.log('Submitting errand:', errand);
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
