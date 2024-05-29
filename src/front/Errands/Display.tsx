import { useState, useEffect } from 'react';
import './errands.css';
import Form from './Form';
import Errand from './Errand';
import { ErrandProps } from './createErrand';

const Display = () => {
  const [errands, setErrands] = useState<ErrandProps[]>([]);

  const handleComplete = async (id: string) => {
    if (!id) {
      console.error(`Attempt to update errand failed. Item is either null or undefined, or function was called without an argument.
      The id logs as ${id}.`);
      return;
    }
    const errandIndex = errands.findIndex((errand) => errand.id === id);

    if (errandIndex === -1) {
      console.error(`Errand with id ${id} not found.`);
      return;
    }

    const errandToUpdate = { ...errands[errandIndex] };
    errandToUpdate.complete = !errandToUpdate.complete;
    errandToUpdate.timeExecuted = errandToUpdate.complete ? Date.now() : 0;

    const payload = {
      complete: errandToUpdate.complete,
      timeExecuted: errandToUpdate.timeExecuted,
    };

    setErrands((prev) => {
      const allErrands = [...prev];
      allErrands[errandIndex] = errandToUpdate;
      return allErrands;
    });
    // update errand in db
    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      const res = await fetch(`http://localhost:3001/errands/${id}`, options);

      if (!res.ok) {
        throw new Error('Failed to update errand in database.');
      }

      console.log(`Errand ${errandToUpdate.name.toUpperCase()} was updated:`);

      console.log(JSON.parse(JSON.stringify(errandToUpdate)));
    } catch (err) {
      console.error(`Error when updating errands: ${err}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error(
        `Attempt to delete errand failed. Item is either null or undefined, or the function was called without an argument. Id logs as ${id}.`
      );
      return;
    }

    const errandIndex = errands.findIndex((errand) => errand.id === id);

    if (errandIndex === -1) {
      console.error(`Errand with id ${id} is not found.`);
      return;
    }

    const errandToDelete = { ...errands[errandIndex] };

    // remove errand from errands state
    setErrands((prevErrands) =>
      prevErrands.filter((errand) => errand.id !== id)
    );

    try {
      const options = {
        method: 'DELETE',
      };

      const res = await fetch(`http://localhost:3001/errands/${id}`, options);
      if (!res.ok) {
        throw new Error(
          `Failed to delete errand from database. Status code: ${res.status}`
        );
      }

      console.log(`Errand ${errandToDelete.name.toUpperCase()} was deleted.`);
    } catch (err) {
      console.error(`Error when deleting errand: ${err}`);
      // add errand back to errands array if error on deleting in database
      setErrands((prevErrands) => [...prevErrands, errandToDelete]);
    }
  };

  useEffect(() => {
    requestErrands();
  }, []);

  async function requestErrands() {
    try {
      const res = await fetch('http://localhost:3001/errands');
      if (!res.ok) {
        throw new Error(`Network response not ok. Status: ${res.status}.`);
      }

      const saved = await res.json();
      setErrands(saved);
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
    }
  }

  return (
    <>
      {/* <hr /> */}
      <div className='errands-container'>
        <div className='errands-title-div'>
          <h2>Errands</h2>
        </div>

        <div className='errands-form-button-container-div'>
          <Form onNewErrandAdd={requestErrands} />
        </div>

        <ul>
          {errands.length > 0 ? (
            errands.map((errand) => (
              <Errand
                key={errand.id}
                id={errand.id}
                name={errand.name}
                complete={errand.complete}
                timeAssigned={errand.timeAssigned}
                timeExecuted={errand.timeExecuted}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p>no errands to complete.</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default Display;
