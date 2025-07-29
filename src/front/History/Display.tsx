import { useState, useEffect } from 'react';
import './index.css';
import List from './List';

export type RoutineHistoryProps = [date: string, routines: string[]];

const Display = () => {
  const [lists, setLists] = useState<RoutineHistoryProps[]>([]);

  useEffect(() => {
    requestLists();
  }, []);

  async function requestLists() {
    try {
      const res = await fetch('http://localhost:3001/list');
      if (!res.ok) {
        throw new Error('Network response error.');
      }
      const data = await res.json();

      // assert types for fetched JSON data safety
      const entries = Object.entries(data) as RoutineHistoryProps[];

      setLists(entries);
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
    }
  }

  return (
    <div>
      <h4>History of Routine Lists</h4>
      {/* <h5>AS TABLE</h5>
      {lists.length > 0 ? (
        <h3>dogs rule</h3>
      ) : (
        <p>no routine history for table</p>
      )} */}
      <ul>
        {/* <h5>AS UL</h5> */}
        {lists.length > 0 ? (
          lists.map((list) => (
            <div key={list[0]}>
              <List
                dateKey={list[0]}
                routines={list[1]}
              />
            </div>
          ))
        ) : (
          <p>no history of routines.</p>
        )}
      </ul>
    </div>
  );
};

export default Display;
