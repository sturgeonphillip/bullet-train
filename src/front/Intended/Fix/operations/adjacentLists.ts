import {
  AdjacentListsResultProps,
  RoutineListHistoryProps,
} from '../../../../types/app.d'
import { apiClient, ApiError } from './apiClient'

function findAdjacentDates(
  inputDate: string,
  routineListHistory: RoutineListHistoryProps
): AdjacentListsResultProps {
  const inputTime = new Date(inputDate).getTime()
  const sortedDates = Object.keys(routineListHistory)
    // only consider dates with tasks/routines
    .filter((date) => routineListHistory[date].routineNames.length > 0)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  if (sortedDates.length === 0) {
    return {
      before: { date: inputDate, routines: [] },
      after: { date: inputDate, routines: [] },
    }
  }

  // find last date before input date
  let beforeDate = null
  let beforeRoutines: string[] = []

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    if (new Date(sortedDates[i]).getTime() < inputTime) {
      beforeDate = sortedDates[i]
      beforeRoutines = routineListHistory[beforeDate].routineNames
      break
    }
  }

  let afterDate = null
  let afterRoutines: string[] = []

  for (let i = 0; i < sortedDates.length; i++) {
    if (new Date(sortedDates[i]).getTime() > inputTime) {
      afterDate = sortedDates[i]
      afterRoutines = routineListHistory[afterDate].routineNames
      break
    }
  }

  return {
    before: {
      date: beforeDate || inputDate,
      routines: beforeRoutines,
    },
    after: {
      date: afterDate || inputDate,
      routines: afterRoutines,
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
