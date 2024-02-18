import { useState, useEffect } from 'react';
import Form from './Form';
import Errand from './Errand';
import { ErrandProps } from './createErrand';

const List = () => {
  const [errands, setErrands] = useState<ErrandProps[]>([]);
  // handleComplete
  const handleComplete = (id) => {
    setErrands((prev) =>
      prev.map((errand) =>
        errand.id === id
          ? {
              ...errand,
              finished: Date.now(),
              complete: !errand.complete,
            }
          : errand
      )
    );
  };

  // fetch errands and set as state
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
                finished={errand.finished}
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

export default List;
