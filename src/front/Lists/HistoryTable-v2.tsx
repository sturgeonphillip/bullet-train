import { useCallback, useEffect, useState } from 'react';
import './history.css';
export interface RoutineHistoryProps {
  [dateKey: string]: string[];
}

export const History = () => {
  type ListItem = [string, string[]];

  const [list, setList] = useState<ListItem[]>([]);

  const requestLists = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/list');
      if (!res.ok) {
        throw new Error(`Network response error. Status code: ${res.status}`);
      }
      const data = await res.json();

      // assert types for fetched JSON data safety
      const entries = Object.entries(data);

      setList(entries);
    } catch (err) {
      console.error(
        `There was a problem with the fetch operation. Status code: ${err}`
      );
    }
  }, []);

  useEffect(() => {
    requestLists();
  }, [requestLists]);

  const entries = Object.entries(list);
  console.log(entries);
  return (
    <>
      {list && list.length && (
        <>
          <div
            id='de-list'
            className='de-list'
          >
            {list.map((x) => {
              // console.log(typeof x[0], x[0]);
              return (
                <DataEntry
                  key={x[0]}
                  keyDate={String(x[0])}
                  tasks={x[1]}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

/**
 * <table>
        <tr>
          <th scope='row'>Monday</th>
          <td>8:00 AM - 9:00 AM</td>
        </tr>
        <tr>
          <th scope='row'>Tuesday</th>
          <td>9:00 AM - 10:00 AM</td>
        </tr>
         <!-- Add more rows as needed --> 
        </table>
 */

// type keyDate = string;
// type tasks = string[];
interface DataEntryProps {
  keyDate: string;
  tasks: string[];
}
const DataEntry = ({ keyDate, tasks }: DataEntryProps) => {
  // if (data) {
  //   dates = Object.keys(data);
  //   tasks = Object.values(data);
  //   console.log('DTS', dates);
  //   console.log('TSK', tasks);

  return (
    <>
      <span>
        <h4>{keyDate}</h4>
        {tasks.map((x) => (
          <p key={x}>{x}</p>
        ))}
      </span>
    </>
  );
};
