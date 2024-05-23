import { useEffect, useState } from 'react';

export interface RoutineHistoryProps {
  [dateKey: string]: string[];
}

export const History = () => {
  const [list, setList] = useState<RoutineHistoryProps[] | null>(null);

  useEffect(() => {
    requestLists();
  }, []);

  async function requestLists() {
    try {
      const res = await fetch('http://localhost:3001/list');
      if (!res.ok) {
        throw new Error('Network response error.');
      }
      const data: RoutineHistoryProps = await res.json();

      // assert types for fetched JSON data safety
      const entries = Object.entries(data);
      const formattedEntries = entries.map(([dataKey, value]) => ({
        [dataKey]: value,
      }));

      console.log('LIST', list);

      setList(formattedEntries);
      console.log('setList');
      console.log('LIST', list);
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
    }
  }

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
