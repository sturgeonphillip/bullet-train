import { useState } from 'react';
import './indexM.css';
import Routine from './RoutinesM/RoutineM';
import { isoDateKey } from '../../utils/dateKey';
import { EntryProps, RoutineProps } from './createEntryM';
import Carriage from './PromptM/PromptCarriage';

const Massive = () => {
  const today = isoDateKey();
  const [entryDate, setEntryDate] = useState(today);
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [promptCarriage, setPromptCarriage] = useState(false);

  async function fetchEntry() {
    if (!entryDate) {
      console.error(`entry data is undefined.`);
      return null;
    }
    try {
      const res = await fetch(`http://localhost:3001/entry/${entryDate}`);

      if (!res.ok) {
        throw new Error('Response not okay in fetchEntry fetch function.');
      }

      const data = await res.json();
      setEntry(data);
      return data;
    } catch (err) {
      console.error(`There was a problem with the fetch operation: ${err}`);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!entryDate) {
      return;
    }
    const storedEntry = await fetchEntry();

    if (storedEntry) {
      setEntry(storedEntry);
    } else {
      setEntry(null);
      setPromptCarriage(true);
    }
  }

  async function handleComplete(entryDate: string, id: string) {
    if (!entry) {
      console.error('Entry is either null or undefined.');
      return;
    }

    const updatedEntry = {
      ...entry,
      routines: entry.routines.map((routine: RoutineProps) => {
        if (routine.id === id) {
          // check state of complete property
          if (routine.complete) {
            return {
              ...routine,
              complete: false,
              timestamp: 0,
            };
          } else {
            return {
              ...routine,
              complete: true,
              timestamp: Date.now(),
            };
          }
        }

        return routine;
      }),
    };
    setEntry(updatedEntry);

    // update database
    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedEntry }),
      };

      const res = await fetch(
        `http://localhost:3001/entry/${entryDate}`,
        options
      );

      if (!res.ok) {
        throw new Error('Failed to update routine in database.');
      }
      console.log('Routine updated successfully.');
    } catch (err) {
      console.error(`Error updating the routine: ${err}`);
    }
  }

  /** *** *** BRAINSTORM *** *** **/
  // bs button pt I, click => show createEntry button & dialogue
  // bs button pt II, click => yes to show routine list options || no to call for today's entry
  // bs button pt III, click => choose which list to set for new entry
  interface RoutineListProps {
    [key: string]: string[];
  }

  interface ListProps {
    choice: [dateKey: string, routines: string[]];
  }

  // interface
  const [showCreateDiv, setShowCreateDiv] = useState(false);
  const [showOptionsDiv, setOptionsDiv] = useState<ListProps | null>(null);
  const [showListsDiv, setShowListsDiv] = useState(false);

  const [listOptions, setListOptions] = useState<ListProps[] | null>(null);
  const [entryList, setEntryList] = useState<ListProps | null>(null);

  function handleBrainstorm() {
    return setShowCreateDiv(true);
  }

  function handleCreate(verdict: boolean) {
    if (verdict === true) {
      // presents a pair of differing lists
      setShowListsDiv(true);
    }
    // closes the prompt
    setShowCreateDiv(false);
  }

  function handleTwoListOptions(key: string) {
    // use key to find the two closest lists (chronologically before & after)
    // set as options
    const a = [
      '2024-04-01',
      ['swab the decks', 'sharpen sword', 'feed parrot'],
    ];
    const b = [
      '2024-02-25',
      ['gargle hot salt water', 'eat brains', 'lace sneakers'],
    ];

    // setListOptions();
  }

  function handleLists(choice: ListProps) {
    setEntryList(choice);
  }

  return (
    <>
      <div>
        <h2>bs example</h2>
        <button onClick={handleBrainstorm}>brainstorm</button>

        {showCreateDiv && (
          <div>
            <h4>Do you want to create a new entry?</h4>
            <button onClick={() => handleCreate(true)}>yes</button>
            <button onClick={() => handleCreate(false)}>no</button>
          </div>
        )}

        {showOptionsDiv && listOptions && (
          <div>
            <table>
              <tr>
                <th>
                  <button onClick={() => handleLists(listOptions[0])}>
                    {showOptionsDiv[0][0]}
                  </button>
                </th>
                <th>
                  <button onClick={() => handleLists(listOptions[1])}>
                    {showOptionsDiv[1]}
                  </button>
                </th>
              </tr>
              {/* {set data} */}
            </table>
          </div>
        )}

        {showListsDiv && <div>{/* list options */}</div>}
        <div>
          <h3>bs lists</h3>
          {entryList && (
            <ul>
              <h4>{entryList[0]}</h4>
              {entryList[1].map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className='massive-container-div'>
        <form onSubmit={handleSubmit}>
          <input
            type='date'
            id='entry-date-id'
            name='entry-date'
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className='entry-input-date'
          />
          <button type='submit'>dogs</button>
        </form>

        {/* handle errors and suspenders */}

        {promptCarriage && (
          <div>
            <div>
              <Carriage />
            </div>
            <div></div>
          </div>
        )}

        {/* display routines */}
        <div className='massive-routines-div'>
          {entry && entry.routines && entry.routines.length > 0 ? (
            entry.routines.map((r) => (
              <Routine
                {...r}
                key={r.id}
                onComplete={() => handleComplete(entryDate, r.id)}
              />
            ))
          ) : (
            <>
              <h4>something, something, and something else</h4>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Massive;
