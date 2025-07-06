export function localDK() {
  return new Date(Date.now()).toLocaleString().split('T')[0];
}

export function getLocalDateKey() {
  const date = new Date(); // current date and time
  const year = date.getFullYear(); // YYYY
  const month = String(date.getMonth() + 1).padStart(2, '0'); // month is zero indexed 0-11
  const day = String(date.getDate()).padStart(2, '0'); // get day of month and pad with leading 0

  return `${year}-${month}-${day}`; // formats date 'YYYY-MM-DD'
}

console.log(getLocalDateKey());

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

console.log(localDK()); // 11/3/2024 8:09:45 PM
