import { useState, useEffect } from 'react'
import {
  EntryProps,
  WizardStateEnum,
  AdjacentListsResultProps,
} from '../../../types/app.d'
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

const EntryDisplay = () => {
  const [entryDate, setEntryDate] = useState(isoDateKey())
  const [entry, setEntry] = useState<EntryProps | null>(null)
  const [wizard, setWizard] = useState<WizardStateEnum>(
    WizardStateEnum.SHOW_ENTRY
  )
  const [adjacentLists, setAdjacentLists] =
    useState<AdjacentListsResultProps | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showToday = async () => {
    setLoading(true)
    setError(null)

    try {
      const todayEntry = await fetchOrCreateTodayEntry()
      setEntry(todayEntry)
      setEntryDate(isoDateKey())
      setWizard(WizardStateEnum.SHOW_ENTRY)
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
        setWizard(WizardStateEnum.SHOW_ENTRY)
      } else {
        setEntry(null)
        setWizard(WizardStateEnum.MISSING_ENTRY)
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
        setWizard(WizardStateEnum.LIST_OPTIONS)
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
      setWizard(WizardStateEnum.SHOW_ENTRY)
    } catch (err) {
      setError('Failed to create entry.')
      console.error('Error create entry:', err)
    } finally {
      setLoading(false)
    }
  }

  const RenderWizard = () => {
    if (loading) {
      return <div className='loading'>Loading...</div>
    }

    switch (wizard) {
      case WizardStateEnum.SHOW_ENTRY:
        return (
          <DisplayEntry
            inputDate={entryDate}
            entry={entry}
            wizard={wizard}
            setEntry={setEntry}
          />
        )

      case WizardStateEnum.MISSING_ENTRY:
        return (
          <DisplayMissing
            inputDate={entryDate}
            handler={handleMissingEntry}
            wizard={wizard}
          />
        )

      case WizardStateEnum.LIST_OPTIONS:
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
        return null
      // return (
      //   <DisplayEntry
      //     inputDate={entryDate}
      //     entry={entry}
      //     wizard={wizard}
      //     setEntry={setEntry}
      //   />
      // )
    }
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type='date'
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
            style={{ color: 'red' }}
          >
            {error}
          </div>
        )}
        <div>{RenderWizard()}</div>
      </div>
    </>
  )
}

export default EntryDisplay

/**
 * 
 * return (
 *   <div>
 *     <div>
 *       <span>
 *         <a
 *           href='http://localhost:3001'
 *           target='_blank'
 *           rel='noopener noreferrer'
 *         >
 *           LINK
 *         </a>
 *       </span>
 *     </div>

* *     <hr />
 *     <hr />
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         type='date'
 *         id='entry-date-id'
 *         name='entry-date'
 *         value={entryDate}
 *         onChange={(e) => setEntryDate(e.target.value)}
 *         disabled={loading}
 *       />
 *       <button
 *         type='submit'
 *         disabled={loading}
 *       >
 *         {loading ? 'Loading...' : 'GO'}
 *       </button>
 *     </form>

* *     {error && (
 *       <div
 *         className='error-message'
 *         style={{
 *           color: 'red',
 *           margin: '10px 0',
 *         }}
 *       >
 *         {error}
 *       </div>
 *     )}

* *     <div>{renderWizard()}</div>

* *     <hr />
 *   </div>
 * )
 */
