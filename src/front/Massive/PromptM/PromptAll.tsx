import { useState } from 'react';
// import { EntryProps } from '../../Massive/createEntryM';
// import { findAppropriateRoutineList } from '../../Massive/createEntryM';

interface PromptEntryProps {
  inputDate: string;
  showEpoch?: () => void;
  handler: (verdict: boolean) => void;
  cleanUp?: () => void;
}

export const PromptEntry = ({ inputDate, handler }: PromptEntryProps) => {
  // const PromptEntry = ({ inputDate, cleanUp }: PromptEntryProps) => {

  return (
    <>
      <p>No data found.</p>
      <p>Would you like to create an entry for {inputDate}?</p>
      <button
        className='pe-btn-yes'
        onClick={() => handler(true)}
      >
        Yes
      </button>
      <button
        className='pe-btn-no'
        onClick={() => handler(false)}
      >
        No
      </button>
    </>
  );
};

interface PromptListProps {
  inputDate: string;
  handler: (verdict: unknown) => void;
  // choices: ListChoiceProps;
}

type ListChoiceProps = [string, string[]];

const choices: ListChoiceProps[] = [
  ['2024-03-29', ['row', 'pray', 'make calls']],
  ['2024-05-02', ['row', 'pray', 'walk dogs']],
];

export const PromptList = ({
  inputDate,
  handler,
  // choices,
}: PromptListProps) => {
  const [before, after] = choices;

  return (
    <div>
      <p>
        The list of routines from {before} is the most recent list prior to{' '}
        {inputDate}, and the earliest after it is from {after}.
      </p>
      <p> Choose a list of routines to use for this new entry.</p>
      <button
        className='pe-btn-before'
        onClick={() => handler(before)}
      >
        Before
      </button>
      <button
        className='pe-btn-after'
        onClick={() => handler(after)}
      >
        After
      </button>
      {/* start */}
      <div>
        <p>
          Which of these routine lists would you like to use to initialize the
          entry?
        </p>

        <div className='choices-container'>
          <div className='choice-section'>
            <button
              className='pe-btn-yes'
              onClick={() => handler(true)}
            >
              <h3>{before[0]}</h3>
              <ul>
                {before[1].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </button>
          </div>

          <div className='choice-section'>
            <button
              className='pe-btn-yes'
              onClick={() => handler(true)}
            >
              <h3>{after[0]}</h3>
              <ul>
                {after[1].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </button>
          </div>

          <div className='choice-section'>
            <button
              className='pe-btn-yes'
              onClick={() => handler(true)}
            >
              Create the entry for
              <p>{inputDate}</p>
              without any routines.
            </button>
          </div>
        </div>
      </div>

      {/* finish */}
    </div>
  );
};

export default PromptEntry;

export const PromptCarriage = () => {
  // const [entry, setEntry] = useState<EntryProps | null>(null);
  const [entryPrompt, setEntryPrompt] = useState(false);
  const [listPrompt, setListPrompt] = useState(false);

  return (
    <>
      {entryPrompt && (
        <PromptEntry
          inputDate={'date'}
          handler={(dog) => console.log(dog)}
        />
      )}
      <button onClick={() => setEntryPrompt}>entry</button>

      {listPrompt && (
        <PromptList
          inputDate={'date'}
          handler={(dog) => console.log(dog)}
          // list={[[], []]}
        />
      )}
      <button onClick={() => setListPrompt}>list</button>
    </>
  );
};

/**
 * 
  function handleListPrompt(choices: string[][]): string[] {
    const a = choices[0];
    const b = choices[1];
    if (a) {
      return a;
    } else {
      return b;
    }
  }

  async function handleEntryPrompt(verdict: boolean) {
    if (verdict === true) {
      console.log('yes!');

      const checkList = await findAppropriateRoutineList(entryDate);

      if (checkList.length > 1) {
        setShowEntryPrompt(false);
        setShowListPrompt(true);
        // prompt user checkList[0] || checkList[1]
        routinesToUse = await handleListPrompt(checkList);
        setShowListPrompt(false);
      } else {
        if (checkList) {
          routinesToUse = checkList[0];
        }
      }

      const entry = createEntry(routinesToUse, entryDate);

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      };

      try {
        const res = await fetch(
          `http://localhost:3001/entry/${entryDate}`,
          options
        );
        if (!res.ok) {
          throw new Error('Network response not ok.');
        }

        // after creating entry, fetch again to ensure latest data
        const createdEntry = await fetchEntry();
        setEntry(createdEntry);
      } catch (err) {
        console.error(
          `Caught error while trying to create entry for ${entryDate}. ${err}`
        );
      }
    } else {
      console.log('no entry will be created.');
    }

    setShowEntryPrompt(false);
  }
 */

// setShowEntryPrompt(false);
//       setShowListPrompt(true);
// setEntry(createdEntry);

// async function handleEntryPrompt(verdict: boolean) {
//   if (verdict === true) {
//     const checkList = await findAppropriateRoutineList(entryDate);

//     if (checkList.length > 1) {
//       setShowEntryPrompt(false);
//       setShowListPrompt(true);

//       // prompt user checkList[0] || checkList[1]
//       routinesToUse = await handleListPrompt(checkList);
//       setShowListPrompt(false);
//     } else {
//       if (checkList) {
//         routinesToUse = checkList[0];
//       }
//     }

//     const entry = createEntry(routinesToUse, entryDate);

//     const options = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(entry),
//     };

//     try {
//       const res = await fetch(
//         `http://localhost:3001/entry/${entryDate}`,
//         options
//       );

//       if (!res.ok) {
//         throw new Error('Network response not ok.');
//       }

//       // fetch after creating entry to ensure latest data
//       const createdEntry = await fetchEntry();
//       setEntry(createdEntry);
//     } catch (err) {
//       console.error(
//         `Caught error while trying to create entry for ${entryDate}. ${err}`
//       );
//     } else {
//       console.log('no entry will be created.');
//     }

//     setShowEntryPrompt(false);
//   }
// }
