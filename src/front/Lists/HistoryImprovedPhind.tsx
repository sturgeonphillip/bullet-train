// import { useEffect, useState } from 'react';

// // Assuming RoutineHistoryProps is correctly defined elsewhere
// interface RoutineHistoryEntry {
//   [key: string]: string[];
// }

// interface RoutineHistoryProps {
//   [dateKey: string]: RoutineHistoryEntry;
// }

// const HistoryComponent = () => {
//   const [routineHistories, setRoutineHistories] =
//     useState<RoutineHistoryProps[]>(null);

//   useEffect(() => {
//     fetchRoutineHistories();
//   }, []);

//   const fetchRoutineHistories = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/list');
//       if (!response.ok) {
//         throw new Error('Failed to fetch routine histories.');
//       }
//       const data: RoutineHistoryProps = await response.json();

//       // Format the data for easier consumption
//       const formattedData = Object.entries(data).reduce(
//         (acc, [key, values]) => {
//           acc[key] = values.map((value, index) => ({
//             [index.toString()]: value,
//           }));
//           return acc;
//         },
//         {} as Record<string, RoutineHistoryEntry[]>
//       );

//       setRoutineHistories(Object.values(formattedData));
//     } catch (error) {
//       console.error(`Error fetching routine histories: ${error}`);
//     }
//   };

//   return (
//     <>
//       <table>
//         {routineHistories && routineHistories.length > 0 ? (
//           routineHistories.map((history, idx) =>
//             Object.entries(history).map(([date, items], itemIdx) => (
//               <React.Fragment key={`${idx}-${itemIdx}`}>
//                 <th>{date}</th>
//                 <tr>
//                   {items.map((item, innerIdx) => (
//                     <td key={`item-${innerIdx}`}>{item}</td>
//                   ))}
//                 </tr>
//               </React.Fragment>
//             ))
//           )
//         ) : (
//           <p>No changes to routine history found.</p>
//         )}
//       </table>
//     </>
//   );
// };

// export default HistoryComponent;

// /**
//  * To improve the given TypeScript React component, we can focus on several aspects including type safety, readability, and performance. Here are some suggestions:
//  *
//  * Type Safety: Ensure that the types used throughout the component accurately reflect the expected data structure This includes the RoutineHistoryProps interface and the handling of the fetched data.
//  * Readability: Improve the readability of the JSX by using more descriptive variable names and simplifying complex expressions.
//  * Performance: Optimize the rendering logic to avoid unnecessary re-renders and improve the overall performance of the component.
//  *
//  * Here's an improved version of the code:
//  */

import React, { useEffect, useState } from 'react';

interface RoutineHistoryEntry {
  [key: string]: string[];
}

interface RoutineHistoryProps {
  [dateKey: string]: RoutineHistoryEntry;
}

const HistoryComponent = () => {
  const [routineHistories, setRoutineHistories] = useState<
    RoutineHistoryProps[] | null
  >(null);

  useEffect(() => {
    fetchRoutineHistories();
  }, []);

  const fetchRoutineHistories = async () => {
    try {
      const response = await fetch('http://localhost:3001/list');
      if (!response.ok) {
        throw new Error('Failed to fetch routine histories.');
      }
      const data: RoutineHistoryProps = await response.json();

      // Correctly format the data
      const formattedData = Object.entries(data).reduce(
        (acc, [key, values]) => {
          acc[key] = values.map((value, index) => ({
            [index.toString()]: value,
          }));
          return acc;
        },
        {} as Record<string, RoutineHistoryEntry[]>
      );

      // Flatten the structure to match the expected type
      setRoutineHistories(Object.values(formattedData));
    } catch (error) {
      console.error(`Error fetching routine histories: ${error}`);
    }
  };

  return (
    <>
      <table>
        {routineHistories && routineHistories.length > 0 ? (
          routineHistories.flatMap((history, idx) =>
            Object.entries(history).flatMap(([date, items], itemIdx) => (
              <React.Fragment key={`${idx}-${itemIdx}`}>
                <th>{date}</th>
                <tr>
                  {items.map((item, innerIdx) => (
                    <td key={`item-${innerIdx}`}>{item}</td>
                  ))}
                </tr>
              </React.Fragment>
            ))
          )
        ) : (
          <p>No changes to routine history found.</p>
        )}
      </table>
    </>
  );
};

export default HistoryComponent;
