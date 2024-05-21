import { useState, useEffect } from 'react';
import './clock.css';

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setTime(new Date()), 1000);

    return () => clearTimeout(timer);
  }, [time]);

  return (
    <>
      <h1
        id='clock'
        className='clock'
      >
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </h1>
    </>
  );
};
