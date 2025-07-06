export function isValidLogDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Date key must be YYYY-MM-DD');
  }

  return true;
}

export const getTodayKey = (tz = 'America/Los_Angeles', locale = 'en-CA') =>
  new Intl.DateTimeFormat(locale, { timeZone: tz }).format(new Date());
