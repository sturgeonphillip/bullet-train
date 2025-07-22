import { useCallback, useEffect, useState } from 'react';
import './history-column.css';
export interface RoutineHistoryProps {
  [dateKey: string]: string[];
}

export const HistoryColumn = () => {
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

  const taskLengths = Object.values(list).reduce((acc, val) => {
    const longest = val[1].length;
    return (acc = longest > acc ? longest : acc);
  }, 0);

  return (
    <>
      {list && list.length && (
        <>
          <div className='history-col-div'>
            <table className='history-col-table'>
              <tbody>
                {list.map((x) => {
                  return (
                    <DataEntryColumns
                      key={x[0]}
                      keyDate={String(x[0])}
                      tasks={x[1]}
                      tableRows={taskLengths}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

interface DataEntryColumnsProps {
  keyDate: string;
  tasks: string[];
  tableRows: number;
}

const DataEntryColumns = ({
  keyDate,
  tasks,
  tableRows,
}: DataEntryColumnsProps) => {
  const cells = tasks.map((task, idx) => (
    <td
      key={`${keyDate}-${idx}-${task}`}
      className='history-col-td'
    >
      {task}
    </td>
  ));

  const emptyCells = Array.from(
    { length: tableRows - tasks.length },
    (_, idx) => (
      <td
        key={`${keyDate}-empty-${idx}`}
        className='history-col-td'
      >
        &nbsp;
      </td>
    )
  );
  return (
    <>
      <tr
        key={keyDate}
        className='history-col-tr'
      >
        <th className='history-col-th'>{keyDate}</th>

        {cells}
        {emptyCells}
      </tr>
    </>
  );
};
