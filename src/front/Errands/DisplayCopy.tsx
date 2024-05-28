import React, { useState, useEffect } from 'react';
import Form from './Form';
import Errand from './Errand';

const Display = () => {
  const [errands, setErrands] = useState([]);

  const handleComplete = async (id) => {
    const errandIndex = errands.findIndex((errand) => errand.id === id);

    if (errandIndex === -1) {
      console.error(`Errand with id ${id} not found.`);
      return;
    }

    // create a copy to update
    const errandToUpdate = {
      ...errands[errandIndex],
    };

    errandToUpdate.complete = !errandToUpdate.complete;
    errandToUpdate.timeExecuted = errandToUpdate.complete ? Date.now() : 0;

    const updatedErrands = [...errands];
    updatedErrands[errandIndex] = errandToUpdate;

    setErrands(updatedErrands);

    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedErrands),
      };

      const res = await fetch(`http://localhost:3001/errands/${id}`, options);

      if (!res.ok) {
        throw new Error('Failed to update errand in database.');
      }

      console.log(`Errand with ${id} was updated.`);
    } catch (err) {
      console.error(`Error when updating errands: ${err}`);
    }
  };

  useEffect(() => {
    requestErrands();
  }, []);

  async function requestErrands() {
    try {
      const res = await fetch('http://localhost:3001/errands');
      if (!res.ok) {
        throw new Error('Network response error.');
      }

      const saved = await res.json();
      setErrands(saved);
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
    }
  }

  return (
    <div>
      <h3>Errands</h3>
      <Form onNewErrandAdd={requestErrands} />
      <ul>
        {errands.length > 0 ? (
          errands.map((errand) => (
            <Errand
              key={errand.id}
              id={errand.id}
              name={errand.name}
              complete={errand.complete}
              onComplete={handleComplete}
              timeExecuted={errand.timeExecuted}
            />
          ))
        ) : (
          <p>no errands to complete.</p>
        )}
      </ul>
    </div>
  );
};

export default Display;
