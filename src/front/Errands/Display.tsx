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

  useEffect(() => {
    requestErrands();
  }, []);

  async function requestErrands() {
    try {
      const res = await fetch('http://localhost:3001/errands');
      if (!res.ok) {
        throw new Error('Network response error.');
      }

      const json = await res.json();
      setErrands(json);
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
    }
  }

  return (
    <div>
      <h3>Errands</h3>
      <Form onNewErrandAdded={requestErrands} />
      <ul>
        {errands.length > 0 ? (
          errands.map((errand) => (
            <li
              key={errand.id}
              className={'errand-li'}
            >
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
          <p>no errands to complete.</p>
        )}
      </ul>
    </div>
  );
};

export default Display;
