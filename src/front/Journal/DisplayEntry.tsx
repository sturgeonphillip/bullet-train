import {
  DisplayEntryProps,
  RoutineProps,
  WizardStateEnum,
} from '../../../types/app'
import { apiClient } from './operations/apiClient'
import Routine from './Routine'

const DisplayEntry = ({
  inputDate,
  entry,
  setEntry,
  wizard,
}: DisplayEntryProps) => {
  if (wizard !== WizardStateEnum.SHOW_ENTRY) {
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

  if (!entry || entry.routines.length === 0) {
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
