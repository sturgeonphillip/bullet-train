import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

const DEFAULT_TZ = 'America/Los_Angeles'

// local 'YYYY-MM-DD' key for a given timestamp (or now)
function getLocalDateKey(unixTime?: number): string {
  return dayjs(unixTime ?? Date.now()).format('YYYY-MM-DD')
}

// UTC-based date key
function getUTCDateKey(unixTime?: number): string {
  return dayjs(unixTime ?? Date.now())
    .utc()
    .format('YYYY-MM-DD')
}

// local 'yesterday' date key
function getYesterdayDateKey(unixTime?: number): string {
  return dayjs(unixTime ?? Date.now())
    .subtract(1, 'day')
    .format('YYYY-MM-DD')
}

// long month name for a given date string
function getLongMonthName(dateString: string): string {
  return dayjs(dateString).format('MMMM')
}

// date key for a fixed timezone (e.g. to keep 'today' stable)
function getTodayKey(tz = DEFAULT_TZ): string {
  return dayjs().tz(tz).format('YYYY-MM-DD')
}

// basic YYYY-MM-DD validator
function isValidLogDate(value: string): boolean {
  if (!/^d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Date key must be in YYYY-MM-DD format.')
  }

  return true
}

export {
  getLocalDateKey,
  getUTCDateKey,
  getYesterdayDateKey,
  getLongMonthName,
  getTodayKey,
  isValidLogDate,
}
