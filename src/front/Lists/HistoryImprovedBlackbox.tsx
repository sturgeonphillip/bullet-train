import { useEffect, useState } from 'react';

export interface RoutineHistoryEntry {
  date: string;
  items: string[];
}

export interface RoutineHistoryProps {
  [date: string]: RoutineHistoryEntry[];
}

export const History = () => {
  const [list, setList] = useState<RoutineHistoryProps | null>(null);

  useEffect(() => {
    requestLists();
  }, []);

  async function requestLists() {
    try {
      const res = await fetch('http://localhost:3001/list');
      if (!res.ok) {
        throw new Error('Network response error: status code ' + res.status);
      }
      const data: RoutineHistoryProps = await res.json();
      setList(data);
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
      setList({});
    }
  }

  return (
    <>
      <table>
        {list && Object.keys(list).length > 0 ? (
          Object.entries(list).map(([date, entries]) => (
            <>
              <thead>
                <tr>
                  <th key='date'>Date: {date}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, innerIdx) => (
                  <tr key={innerIdx}>
                    <td>
                      {entry.items.map((item, idx) => (
                        <div key={idx}>{item}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ))
        ) : (
          <p>no changes to routine history.</p>
        )}
      </table>
    </>
  );
};

/**
 * I'm glad to see your TypeScript code is already well-structured and typed! I've provided some suggestions to improve the code further.
 * 
 * 1. Add types for RoutineHistoryProps keys and values.
Improve error handling by providing a more informative error message.
* 2. Simplify the code by directly using the entries array
* 3. Add proper table headers.
* 4. Use key prop in <th> elements.
* 
*/
