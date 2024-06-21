import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

export interface BottleProps {
  dateKey?: string;
  id: string;
  ounces: number[];
  setOunces: (oz: number[]) => void;
}

export const Bottle2 = ({ id, ounces, setOunces, dateKey }: BottleProps) => {
  const color = `${id}`;

  const [focus, setFocus] = useState(false);
  // const [blur, setBlur] = useState(false);

  const handleFocus = () => {
    setFocus(true);
  };
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setFocus(false);
    console.log(`Element lost focus: ${e.target.className}`);
  };

  const focusStyle = focus ? 'focus-glow' : '';

  // debounce
  let debounceTimer: NodeJS.Timeout;

  const debounceFetch = (value: number) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      // perform fetch request here
      console.log(`fetch request w/ value:`, value);

      // replace console.log() with fetch request to update database
      const reqBody = {
        ounces: ounces[0],
        color,
      };
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      };

      (async () => {
        await fetch(`http://localhost:3001/water/${dateKey}`, options);
      })();
      console.log('added to the db!', JSON.stringify(reqBody));
    }, 1500); // adjust delay as needed
  };

  const handleSliderChange = (newValue: number) => {
    setOunces([newValue]);

    // call function to debounce fetch request
    debounceFetch(newValue);
  };

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
          defaultValue={[0]}
          step={4}
          max={32}
          orientation='vertical'
          // value={ounces}
          // onValueChange={setOunces}
          value={ounces}
          onValueChange={(newValues) => handleSliderChange(newValues[0])}
          className={`bottle-slider-root ${focusStyle}`}
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
            onFocus={() => handleFocus()}
            onBlur={(e) => handleBlur(e)}
            className={`${color} bottle-thumb-${ounces[0] === 0 ? 'empty' : ounces[0] === 32 ? 'full' : 'div'}`}
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
