// import { DisplayEntryProps, RoutineProps } from './types';
// import { Routine } from './Routine';
// // shows current entry according to entryDate
// // default active display component
// export const DisplayEntry = ({
//   inputDate,
//   entry,
//   setEntry,
//   wizard,
// }: DisplayEntryProps) => {
//   if (wizard !== 0) {
//     return null;
//   }

//   async function handleComplete(entryDate: string, id: string) {
//     if (!entry) {
//       console.error(
//         `Attempt to update a routine failed. Entry is either null or undefined. Entry logs as: ${entry}`
//       );
//       return;
//     }
//     // create the updated entry
//     const updatedEntry = {
//       ...entry,
//       routines: entry.routines.map((r: RoutineProps) => {
//         if (r.id === id) {
//           if (r.complete) {
//             return {
//               ...r,
//               complete: false,
//               timestamp: 0,
//             };
//           } else {
//             return {
//               ...r,
//               complete: true,
//               timestamp: Date.now(),
//             };
//           }
//         }
//         return r;
//       }),
//     };

//     // apply to DOM
//     setEntry(updatedEntry);

//     // update entry in database
//     try {
//       const options = {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedEntry),
//       };

//       const res = await fetch(
//         `http://localhost:3001/entry/${entryDate}`,
//         options
//       );

//       if (!res.ok) {
//         throw new Error('Failed to update routine in database.');
//       }
//       console.log(`Entry for ${entryDate} was updated: ${updatedEntry}`);
//     } catch (err) {
//       console.error(`Error when updating the routine: ${err}`);
//     }
//   }

//   return (
//     <>
//       <div className=''>
//         {entry && entry.routines ? (
//           entry.routines.length > 0 ? (
//             entry.routines.map((r: RoutineProps) => (
//               <Routine
//                 {...r}
//                 key={r.id}
//                 onComplete={() => handleComplete(inputDate, r.id)}
//               />
//             ))
//           ) : (
//             <>
//               <h4>Entry for {inputDate} is empty.</h4>
//               <p>Add some routines.</p>
//             </>
//           )
//         ) : (
//           false
//           // NOTE: if false doesn't work, just repeat above:
//           // <>
//           //     <h4>Entry for {entryDate} is empty.</h4>
//           //     <p>Add some routines.</p>
//           //   </>
//           // TODO: find a way to apply one response to two falsy conditionals
//         )}
//       </div>
//     </>
//   );
// };

import { DisplayEntryProps, RoutineProps, WizardState, ApiError } from './types'
import { apiClient } from './operations/apiClient'
import Routine from './Routine'

const DisplayEntry = ({
  inputDate,
  entry,
  setEntry,
  wizard,
}: DisplayEntryProps) => {
  if (wizard !== WizardState.SHOW_ENTRY) {
    return null
  }

  const handleComplete = async (entryDate: string, id: string) => {
    if (!entry) {
      console.error('Cannot update routine: entry is null or undefined.')
      return
    }

    const updatedEntry = {
      ...entry,
      routines: entry.routines.map((routine: RoutineProps) => {
        if (routine.id === id) {
          return {
            ...routine,
            complete: !routine.complete,
            timestamp: routine.complete ? 0 : Date.now(),
          }
        }
        return routine
      }),
    }

    setEntry(updatedEntry)

    try {
      await apiClient.updateEntry(entryDate, updatedEntry)
    } catch (err) {
      // revert on failure
      setEntry(entry)
      console.error('Failed to update routine:', err)
      // TODO: show user-friendly error message
    }
  }

  if (!entry || !entry.routines) {
    return (
      <div>
        <h4>Entry for {inputDate} is empty.</h4>
        <p>Add some routines.</p>
      </div>
    )
  }

  if (entry.routines.length === 0) {
    return (
      <div>
        <h4>Entry for {inputDate} is empty.</h4>
        <p>Add some routines.</p>
      </div>
    )
  }

  return (
    <div>
      <ul>
        {entry.routines.map((routine: RoutineProps) => (
          <Routine
            key={routine.id}
            {...routine}
            onComplete={() => handleComplete(inputDate, routine.id)}
          />
        ))}
      </ul>
    </div>
  )
}

export default DisplayEntry
