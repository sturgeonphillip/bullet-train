// TODO: find better placement/organization for these functions/modifiers

// import { ONE_DAY, isOlderThan } from '../../utils/errandVisibility'
import type { ErrandProps } from '../../types/appTypes.ts'

export function filterVisibleErrands(errands: ErrandProps[]): ErrandProps[] {
  return errands.filter((errand) => {
    if (!errand.timeExecuted) return true

    return !isOlderThan(errand.timeExecuted, ONE_DAY)
  })
}

export function isOlderThan(timestamp: number, ms: number): boolean {
  return Date.now() - timestamp > ms
}

// TODO: create enums?
export const ONE_MINUTE = 60 * 1000
export const ONE_HOUR = ONE_MINUTE * 60
export const ONE_DAY = ONE_HOUR * 24
