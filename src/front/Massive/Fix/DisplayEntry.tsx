import { DisplayEntryProps, RoutineProps } from './types';
import { Routine } from './Routine';
// shows current entry according to entryDate
// default active display component
export const DisplayEntry = ({
  inputDate,
  entry,
  setEntry,
  wizard,
}: DisplayEntryProps) => {
  if (wizard !== 0) {
    return null;
  }

  async function handleComplete(entryDate: string, id: string) {
    // create the updated entry
    const updatedEntry = {
      ...entry,
      routines: entry.routines.map((r: RoutineProps) => {
        if (r.id === id) {
          if (r.complete) {
            return {
              ...r,
              complete: false,
              timestamp: 0,
            };
          } else {
            return {
              ...r,
              complete: true,
              timestamp: Date.now(),
            };
          }
        }
        return r;
      }),
    };

    // apply to DOM
    setEntry(updatedEntry);

    // update entry in database
    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEntry),
      };

      const res = await fetch(
        `http://localhost:3001/entry/${entryDate}`,
        options
      );

      if (!res.ok) {
        throw new Error('Failed to update routine in database.');
      }
      console.log(`Entry for ${entryDate} was updated: ${updatedEntry}`);
    } catch (err) {
      console.error(`Error when updating the routine: ${err}`);
    }
  }

  return (
    <>
      <div className=''>
        {entry && entry.routines ? (
          entry.routines.length > 0 ? (
            entry.routines.map((r: RoutineProps) => (
              <Routine
                {...r}
                key={r.id}
                onComplete={() => handleComplete(entryDate, r.id)}
              />
            ))
          ) : (
            <>
              <h4>Entry for {entryDate} is empty.</h4>
              <p>Add some routines.</p>
            </>
          )
        ) : (
          false
          // NOTE: if false doesn't work, just repeat above:
          // <>
          //     <h4>Entry for {entryDate} is empty.</h4>
          //     <p>Add some routines.</p>
          //   </>
          // TODO: find a way to apply one response to two falsy conditionals
        )}
      </div>
    </>
  );
};
