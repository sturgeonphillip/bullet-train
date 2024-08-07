export function localDTKey() {
  return new Date(Date.now()).toLocaleString().split('T')[0];
}

export function isoDateKey() {
  return new Date().toISOString().split('T')[0];
}

export function intlDTFKey() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  return formatter.format(now);
}

export function longMonthFormat(dateString: string) {
  const date = new Date(dateString);

  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
  const formattedMonth = monthFormatter.format(date);

  return formattedMonth;
}

longMonthFormat('2024-02-29');
