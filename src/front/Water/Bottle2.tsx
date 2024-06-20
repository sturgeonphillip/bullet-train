import * as Slider from '@radix-ui/react-slider';
// import { useEffect, useState } from 'react';

export interface BottleProps {
  dateKey?: string;
  id: string;
  ounces: number[];
  setOunces: (oz: number[]) => void;
}

export const Bottle2 = ({ id, ounces, setOunces, dateKey }: BottleProps) => {
  const color = `bottle-${id}`;
  if (dateKey === '2024-02-29') {
    console.log(dateKey, 'DOGS');
  }

  // debounce
  let debounceTimer: NodeJS.Timeout;

  const debounceFetch = (value: number) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      // perform fetch request here
      console.log(`fetch request w/ value:`, value);

      // replace console.log() with fetch request to update database
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ounces),
      };

      (async () => {
        await fetch(`http://localhost:3001/water/${dateKey}`, options);
      })();
      console.log('added to the db!');
    }, 1500); // adjust delay as needed
  };

  const handleSliderChange = (newValue: number) => {
    setOunces([newValue]);

    // call function to debounce fetch request
    debounceFetch(newValue);
  };

  // useEffect(() => {
  //   debounceFetch(slider); // initial fetch or other initialization logic
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <div className={`bottle-container-div ${color}`}>
        {/* cap */}
        <div className='bottle-cap-div'></div>

        {/* overflow */}
        <div
          className={`bottle-overflow-div + ${ounces[0] < 32 ? 'empty' : 'full'}`}
        ></div>

        <Slider.Root
          className='bottle-slider-root'
          defaultValue={[0]}
          step={4}
          max={32}
          orientation='vertical'
          // value={ounces}
          // onValueChange={setOunces}
          value={ounces}
          onValueChange={(newValues) => handleSliderChange(newValues[0])}
        >
          <Slider.Track
            id='track'
            className='bottle-slider-track'
          >
            <Slider.Range
              className={`bottle-slider-range + ${ounces[0] < 32 ? 'empty' : 'full'}`}
            />
          </Slider.Track>
          <Slider.Thumb
            className={`${ounces[0] === 0 ? 'bottle-thumb-empty' : ounces[0] === 32 ? 'bottle-thumb-full' : 'bottle-thumb-div'}`}
          />
        </Slider.Root>
        <p className='ounces-p'>{ounces[0]}</p>
      </div>
    </>
  );
};

/**
 * 
  // track changes with local state
  // const [localOz, setLocalOz] = useState(ounces);

  // useEffect(() => {
  //   // update when props changes
  //   // setLocalOz(ounces);
  // }, [ounces]);

  // useEffect(() => {
  //   const timeoutId = setTimeout(async () => {
  //     // send update to server after debounce delay
  //     const options = {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(localOz),
  //     };
  //     await fetch(`http://localhost:3001/water/${id}`, options).then(() => {
  //       // update global state after successful update
  //       setOunces(localOz);
  //     });
  //     // cleanup function clears timeout if component unmounts or there's a new update
  //     return () => clearTimeout(timeoutId);
  //   }, 500); // debounce delay in ms

  //   return () => clearTimeout(timeoutId); // return cleanup
  // }, [id, localOz, setOunces]);
 */
