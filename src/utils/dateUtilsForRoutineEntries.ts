export function isoDateKey(unixTime?: number): string {
  const time = unixTime ?? Date.now()
  const date = new Date(time)
  return date.toISOString().split('T')[0]
}

export function yesterdayDateKey(unixTime?: number): string {
  const unix = unixTime ?? Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  const date = new Date(unix - oneDay)
  return date.toISOString().split('T')[0]
}
