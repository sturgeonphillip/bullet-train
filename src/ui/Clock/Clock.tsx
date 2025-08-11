import { useState, useEffect } from 'react';
import './clock.css';

export const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(new Date());
      setToday(new Date());
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, today]);

  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedDate = formatter.format(today);
  // console.log(formattedDate.replace(/,\s/, ' '), 'dogs');
  return (
    <>
      <h1
        id='clock'
        className='clock'
      >
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </h1>
      <h2>{formattedDate}</h2>
    </>
  );
};
