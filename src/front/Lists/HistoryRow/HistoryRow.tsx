import { useCallback, useEffect, useState } from 'react';
import './history-row.css';
export interface RoutineHistoryProps {
  [dateKey: string]: string[];
}

export const HistoryRow = () => {
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

  return (
    <table
      className='history-table'
      id='history-list-table'
    >
      <tbody className='history-tbody'>
        {list.map((x, index) => (
          <tr
            key={index}
            className='history-tr'
          >
            <th className='history-th'>{x[0]}</th>
            {x[1].map((item, itemIndex) => (
              <td
                key={itemIndex}
                className='history-td'
              >
                {item}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
