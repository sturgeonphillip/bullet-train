export function localDTKey() {
  return new Date(Date.now()).toLocaleString().split('T')[0];
}
export function isoDateKey() {
  return new Date(Date.now()).toISOString().split('T')[0];
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
