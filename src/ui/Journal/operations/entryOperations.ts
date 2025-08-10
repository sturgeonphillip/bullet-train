import { EntryProps } from '../../../types/appTypes'
import { apiClient, ApiError } from './apiClient'
import { createEntry } from './routineUtils'
import { getUTCDateKey } from '../../../utils/dateUtils'
import { getAdjacentLists } from './adjacentLists'

export async function fetchOrCreateTodayEntry(): Promise<EntryProps | null> {
  try {
    // first try to get today's entry from the server
    const todayEntry = await apiClient.fetchTodayEntry()
    if (todayEntry) {
      return todayEntry
    }

    // if no entry exists, create one based on most recent list
    const today = getUTCDateKey()
    const adjacentLists = await getAdjacentLists(today)

    // use most recent list (before) if available, otherwise empty
    const routinesToUse =
      adjacentLists.before.routines.length > 0
        ? adjacentLists.before.routines
        : []

    const newEntry = createEntry(routinesToUse, today)
    return await apiClient.createEntry(today, newEntry)
  } catch (err) {
    console.error('Error in fetchOrCreateTodayEntry:', err)
    return null
  }
}

export async function createEntryFromRoutines(
  date: string,
  routines: string[]
): Promise<EntryProps> {
  try {
    const entry = createEntry(routines, date)
    return await apiClient.createEntry(date, entry)
  } catch (err) {
    console.error('Error createing entry from routines:', err)
    throw new ApiError({
      message: 'Failed to create entry.',
    })
  }
}

/**
 * createEntry
 * createErrand
 * createRoutine
 * createRoutineList
 * createToday
 */
