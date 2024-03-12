import { useState, useEffect } from 'react';
import './index.css';
import List from './List';
export type RoutineHistoryProps = [date: string, routines: unknown[]];

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
      <ul>
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
