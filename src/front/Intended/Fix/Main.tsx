// import { useEffect, useState } from 'react';
// import './fix.css';
// // import ListHistory from '../../Lists/Display';
// import { DisplayEntry } from './DisplayEntry';
// import { DisplayMissing } from './DisplayMissing';
// import { DisplayListOption } from './DisplayListOption';
// import { fetchEntry, isoDateKey } from './operations/fixFunctions';
// import { EntryProps } from './types';

// const Main = () => {
//   const [entryDate, setEntryDate] = useState(isoDateKey());
//   const [entry, setEntry] = useState<EntryProps | null>(null);
//   const [wizard, setWizard] = useState(0);

//   async function showDogToday() {
//     const res = await fetch(`http://localhost:3001/today`);
//     const json = await res.json();

//     // if (json) {
//     setEntry(json);
//     // }
//   }

//   useEffect(() => {
//     showDogToday();
//   }, []);

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (!entryDate) {
//       return; // prevent an empty request
//     }

//     const submittedEntry = await fetchEntry(entryDate);
//     console.log('STORED', submittedEntry);
//     if (submittedEntry) {
//       setEntry(submittedEntry);
//       setWizard(0);
//     } else {
//       setEntry(null);
//       setWizard(1);
//     }
//   }

//   function handleMissingEntry(verdict: boolean) {
//     if (verdict === true) {
//       console.log('TRUE');
//       setWizard(2);
//     } else if (verdict === false) {
//       console.log('FALSE');
//       setEntry(null);
//       setEntryDate(isoDateKey());
//       setWizard(0);
//     }
//     return;
//   }

//   function renderWizard() {
//     switch (wizard) {
//       case 0:
//         return (
//           <div>
//             <DisplayEntry
//               inputDate={entryDate}
//               entry={entry}
//               wizard={wizard}
//               setEntry={setEntry}
//             />
//           </div>
//         );
//       case 1:
//         return (
//           <div>
//             <DisplayMissing
//               inputDate={entryDate}
//               handler={(verdict) => handleMissingEntry(verdict)}
//               wizard={wizard}
//             />
//           </div>
//         );
//       case 2:
//         return (
//           <div>
//             <DisplayListOption
//               inputDate={entryDate}
//               candidates={[]}
//               wizard={wizard}
//               setWizard={setWizard}
//             />
//           </div>
//         );

//       // TODO: is this default case necessary or repetitive? what's a fail safe?
//       default:
//         return (
//           <div>
//             <DisplayEntry
//               inputDate={entryDate}
//               entry={entry}
//               wizard={wizard}
//               setEntry={setEntry}
//             />
//           </div>
//         );
//     }
//   }

//   return (
//     <>
//       <div>
//         <span>
//           <a
//             href='http://localhost:3001'
//             target='_blank'
//           >
//             LINK
//           </a>
//         </span>
//       </div>
//       <hr />
//       <form onSubmit={handleSubmit}>
//         <input
//           type='date'
//           id='entry-date-id'
//           name='entry-date'
//           value={entryDate}
//           onChange={(e) => setEntryDate(e.target.value)}
//           className=''
//         />
//         <button type='submit'>GO</button>
//       </form>

//       <div>{renderWizard()}</div>
//       <hr />
//       {/* <ListHistory /> */}
//     </>
//   );
// };

// export default Main;

import { useState, useEffect } from 'react'
import { EntryProps, WizardState, AdjacentListsResult } from './types'
import { isoDateKey } from '../../../utils/dateUtilsForRoutineEntries'
import { apiClient } from './operations/apiClient'
import { getAdjacentLists } from './operations/adjacentLists'
import {
  fetchOrCreateTodayEntry,
  createEntryFromRoutines,
} from './operations/entryOperations'
import DisplayEntry from './DisplayEntry'
import DisplayMissing from './DisplayMissing'
import DisplayListOption from './DisplayListOption'
import './fix.css'

const Main = () => {
  const [entryDate, setEntryDate] = useState(isoDateKey())
  const [entry, setEntry] = useState<EntryProps | null>(null)
  const [wizard, setWizard] = useState<WizardState>(WizardState.SHOW_ENTRY)
  const [adjacentLists, setAdjacentLists] =
    useState<AdjacentListsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showToday = async () => {
    setLoading(true)
    setError(null)

    try {
      const todayEntry = await fetchOrCreateTodayEntry()
      setEntry(todayEntry)
      setEntryDate(isoDateKey())
      setWizard(WizardState.SHOW_ENTRY)
    } catch (err) {
      setError("Failed to load today's entry")
      console.error('Error loading today:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    showToday()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!entryDate) return

    setLoading(true)
    setError(null)

    try {
      const submittedEntry = await apiClient.fetchEntry(entryDate)

      if (submittedEntry) {
        setEntry(submittedEntry)
        setWizard(WizardState.SHOW_ENTRY)
      } else {
        setEntry(null)
        setWizard(WizardState.MISSING_ENTRY)
      }
    } catch (err) {
      setError('Failed to fetch entry.')
      console.error('Error fetching entry:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMissingEntry = async (verdict: boolean) => {
    if (verdict) {
      setLoading(true)

      try {
        const lists = await getAdjacentLists(entryDate)
        setAdjacentLists(lists)
        setWizard(WizardState.LIST_OPTIONS)
      } catch (err) {
        setError('Failed to load list options.')
        console.error('Error getting adjacent lists:', err)
      } finally {
        setLoading(false)
      }
    } else {
      // user declined to create an entry, return to today
      showToday()
    }
  }

  const handleCreateEntry = async (routines: string[]) => {
    setLoading(true)
    setError(null)

    try {
      const newEntry = await createEntryFromRoutines(entryDate, routines)
      setEntry(newEntry)
      setWizard(WizardState.SHOW_ENTRY)
    } catch (err) {
      setError('Failed to create entry.')
      console.error('Error create entry:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderWizard = () => {
    if (loading) {
      return <div className='loading'>Loading...</div>
    }

    switch (wizard) {
      case WizardState.SHOW_ENTRY:
        return (
          <DisplayEntry
            inputDate={entryDate}
            entry={entry}
            wizard={wizard}
            setEntry={setEntry}
          />
        )

      case WizardState.MISSING_ENTRY:
        return (
          <DisplayMissing
            inputDate={entryDate}
            handler={handleMissingEntry}
            wizard={wizard}
          />
        )

      case WizardState.LIST_OPTIONS:
        return adjacentLists ? (
          <DisplayListOption
            inputDate={entryDate}
            candidates={adjacentLists}
            wizard={wizard}
            setWizard={setWizard}
            onCreateEntry={handleCreateEntry}
          />
        ) : null

      default:
        return (
          <DisplayEntry
            inputDate={entryDate}
            entry={entry}
            wizard={wizard}
            setEntry={setEntry}
          />
        )
    }
  }

  return (
    <div>
      <div>
        <span>
          <a
            href='http://localhost:3001'
            target='_blank'
            rel='noopener noreferrer'
          >
            LINK
          </a>
        </span>
      </div>

      <hr />
      <hr />
      <form onSubmit={handleSubmit}>
        <input
          type='date'
          id='entry-date-id'
          name='entry-date'
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          disabled={loading}
        />
        <button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Loading...' : 'GO'}
        </button>
      </form>

      {error && (
        <div
          className='error-message'
          style={{
            color: 'red',
            margin: '10px 0',
          }}
        >
          {error}
        </div>
      )}

      <div>{renderWizard()}</div>

      <hr />
    </div>
  )
}

export default Main
