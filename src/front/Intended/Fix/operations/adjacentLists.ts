import { ListProps, AdjacentListsResultProps, ApiError } from '../types'
import { apiClient } from './apiClient'

function findAdjacentDates(
  inputDate: string,
  listDB: ListProps
): AdjacentListsResultProps {
  const inputTime = new Date(inputDate).getTime()
  const sortedDates = Object.keys(listDB)
    // only consider dates with tasks/routines
    .filter((date) => listDB[date]?.length > 0)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  if (sortedDates.length === 0) {
    return {
      before: { date: inputDate, practices: [] },
      after: { date: inputDate, practices: [] },
    }
  }

  // find last date before input date
  let beforeDate = null
  let beforeRoutines: string[] = []

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    if (new Date(sortedDates[i]).getTime() < inputTime) {
      beforeDate = sortedDates[i]
      beforeRoutines = listDB[beforeDate]
      break
    }
  }

  let afterDate = null
  let afterRoutines: string[] = []

  for (let i = 0; i < sortedDates.length; i++) {
    if (new Date(sortedDates[i]).getTime() > inputTime) {
      afterDate = sortedDates[i]
      afterRoutines = listDB[afterDate]
      break
    }
  }

  return {
    before: {
      date: beforeDate || inputDate,
      practices: beforeRoutines,
    },
    after: {
      date: afterDate || inputDate,
      practices: afterRoutines,
    },
  }
}

export async function getAdjacentLists(
  inputDate: string
): Promise<AdjacentListsResultProps> {
  try {
    const listData = await apiClient.fetchLists()
    return findAdjacentDates(inputDate, listData)
  } catch (err) {
    console.error('Error feching adjacent lists:', err)
    throw new ApiError({
      message: 'Unable to fetch list data for adjacent dates.',
    })
  }
}
