import { useState, useEffect } from 'react';
import Form from './Form';
import Errand from './Errand';
import { ErrandProps } from './createErrand';

const Display = () => {
  const [errands, setErrands] = useState<ErrandProps[]>([]);

  const handleComplete = (id: string) => {
    setErrands((prev) =>
      prev.map((errand) => {
        if (errand.id === id) {
          return errand.complete === false
            ? {
                ...errand,
                complete: true,
                timeExecuted: Date.now(),
              }
            : {
                ...errand,
                complete: false,
                timeExecuted: 0,
              };
        }
        return errand;
      })
    );
  };

  // when a new errand is submitted, the data goes to the db, but it doesn't update on the page until hitting refresh
  useEffect(() => {
    fetch('http://localhost:3001/errands')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response error.');
        }
        return res.json();
      })
      .then((saved) => setErrands(saved))
      .catch((err) => {
        console.error(`There was a problem with the fetch operation: ${err}`);
      });
  }, []);

  return (
    <div>
      <h3>Errands</h3>
      <Form />
      <ul>
        {errands.length > 0 ? (
          errands.map((errand) => (
            <li key={errand.id}>
              <Errand
                id={errand.id}
                name={errand.name}
                complete={errand.complete}
                onComplete={handleComplete}
                timeExecuted={errand.timeExecuted}
              />
            </li>
          ))
        ) : (
          <p>no errands to complete!</p>
        )}
      </ul>
    </div>
  );
};

export default Display;
