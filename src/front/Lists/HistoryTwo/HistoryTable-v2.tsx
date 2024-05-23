import { useCallback, useEffect, useState } from 'react';
import './history2.css';
export interface RoutineHistoryProps {
  [dateKey: string]: string[];
}

const History = () => {
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
      const entries = Object.entries(data).map(([key, value]) => {
        if (!Array.isArray(value)) {
          throw new Error(
            `Expected value to be an array, got ${typeof value} instead.`
          );
        }

        return [key, value] as ListItem;
      });

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
          <table>
            {list.map((x) => {
              return (
                <DataEntry
                  key={x[0]}
                  keyDate={String(x[0])}
                  tasks={x[1]}
                />
              );
            })}
          </table>
        </>
      )}
    </>
  );
};

interface DataEntryProps {
  keyDate: string;
  tasks: string[];
}

const DataEntry = ({ keyDate, tasks }: DataEntryProps) => {
  return (
    <>
      <tr key={keyDate}>
        <th>{keyDate}</th>
        {tasks.map((x) => (
          <td key={x}>{x}</td>
        ))}
      </tr>
    </>
  );
};

export default History;
