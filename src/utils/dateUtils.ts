// core local date key (YYYY-MM-DD based on local system or specific timezone)
function getLocalDateKey(unixTime?: number): string {
  const date = new Date(unixTime ?? Date.now())
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// utc-based key (server logic)
function getUTCDateKey(unixTime?: number): string {
  return new Date(unixTime ?? Date.now()).toISOString().split('T')[0]
}

// yesterday (in local time)
function getYesterdayDateKey(unixTime?: number): string {
  const date = new Date(unixTime ?? Date.now())
  date.setDate(date.getDate() - 1)
  return getLocalDateKey(date.getTime())
}

// date display formatters
function getLongMonthName(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
}

// date key validator
function isValidLogDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Date key must be YYYY-MM-DD')
  }

  return true
}

// fixed time zone support (e.g., 'America/Los_Angeles')
function getTodayKey(tz = 'America/Los_Angeles', locale = 'en-CA'): string {
  // produces 'YYYY-MM-DD' for the target timezone
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .split('/')

  // note: en-CA locale gives us 'YYYY-MM-DD' if we split like this
  return parts.join('-')
}

// if exact parsing is preferred to avoid locale inconsistencies,
// consider using Intl.DateTimeFormat().formatToParts() instead

export {
  getLocalDateKey,
  getUTCDateKey,
  getYesterdayDateKey,
  getLongMonthName,
  getTodayKey,
  isValidLogDate,
}
