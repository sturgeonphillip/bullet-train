import { useCallback, useEffect, useState } from 'react';
import './history1.css';
export interface RoutineHistoryProps {
  [dateKey: string]: string[];
}

const History = () => {
  const [list, setList] = useState<RoutineHistoryProps[] | null>(null);

  const requestLists = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/list');
      if (!res.ok) {
        throw new Error(`Network response error. Status code: ${res.status}`);
      }

      const data: RoutineHistoryProps = await res.json();

      const entries = Object.entries(data);
      const formattedEntries = entries.map(([dataKey, value]) => ({
        [dataKey]: value,
      }));

      setList(formattedEntries);
    } catch (err) {
      console.error(`There was a problem fetching within requestLists: ${err}`);
    }
  }, []);

  useEffect(() => {
    requestLists();
  }, [requestLists]);

  return (
    <>
      <table>
        {list && Object.keys(list).length > 0 ? (
          list.map((value) => (
            <>
              <th>{Object.keys(value)[0]}</th>
              {value[Object.keys(value)[0]].map(
                (item: string, innerIdx: number) => (
                  <tr>
                    <td key={innerIdx}>{item}</td>
                  </tr>
                )
              )}
            </>
          ))
        ) : (
          <p>no changes to routine history.</p>
        )}
      </table>
    </>
  );
};

export default History;
