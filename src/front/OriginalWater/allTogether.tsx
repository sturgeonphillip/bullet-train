import { useState } from 'react';
import './water.css';
import * as Slider from '@radix-ui/react-slider';

interface TotalOzProps {
  color: string;
  ounces: number[];
  setOunces: (value: number[]) => void;
  commitValue: (value: number[]) => void;
}

interface DebounceFetchProps {
  timeout: NodeJS.Timeout | null;
  abort: AbortController | null;
  value: number;
  dateKey: string;
}

function isoDateKey() {
  return new Date(Date.now()).toISOString().split('T')[0];
}

function debounceTotalOz({
  // timeout = null,
  // abort = null,
  timeout,
  abort,
  value,
  // dateKey,
}: DebounceFetchProps) {
  if (timeout) {
    clearTimeout(timeout);
  }

  if (abort) {
    abort.abort();
  }

  abort = new AbortController();

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
    signal: abort.signal,
  };

  timeout = setTimeout(() => {
    console.log(options.body);
    // fetch(`http://localhost:3001/water/${dateKey}`, options)
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw new Error('Failed to update water data.');
    //     }
    //     console.log('Successfully updated water data.');
    //   })
    //   .catch((err) => {
    //     console.error(`Error updating water data: ${err}`);
    //   });
  }, 2000);

  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };
}

const Display = () => {
  const currentDateKey = isoDateKey();
  const [blueOunces, setBlueOunces] = useState([0]);
  const [pinkOunces, setPinkOunces] = useState([0]);
  const [orangeOunces, setOrangeOunces] = useState([0]);
  const [greenOunces, setGreenOunces] = useState([0]);

  const totalOunces = [
    blueOunces,
    pinkOunces,
    orangeOunces,
    greenOunces,
  ].reduce((acc, crv) => {
    return (acc += crv[0]);
  }, 0);

  const timeoutId: NodeJS.Timeout | null = null;
  const abortController: AbortController | null = null;

  const handleSliderCommit = () => {
    const debouncedValues: DebounceFetchProps = {
      timeout: timeoutId,
      abort: abortController,
      value: totalOunces,
      dateKey: currentDateKey,
    };

    debounceTotalOz(debouncedValues);
  };
  return (
    <>
      <div className='bottle-display-div'>
        <div className='bottle-group-div'>
          <Bottle
            color={'blue'}
            ounces={blueOunces}
            setOunces={setBlueOunces}
            commitValue={handleSliderCommit}
          />
          <Bottle
            color={'pink'}
            ounces={pinkOunces}
            setOunces={setPinkOunces}
            commitValue={handleSliderCommit}
          />
          <Bottle
            color={'orange'}
            ounces={orangeOunces}
            setOunces={setOrangeOunces}
            commitValue={handleSliderCommit}
          />
          <Bottle
            color={'green'}
            ounces={greenOunces}
            setOunces={setGreenOunces}
            commitValue={handleSliderCommit}
          />
        </div>
        <h3>Total Ounces: {totalOunces}</h3>
      </div>
    </>
  );
};

export default Display;

const Bottle = ({
  // id,
  color,
  ounces,
  setOunces,
  // dateKey
  commitValue,
}: TotalOzProps) => {
  // }: BottleProps) => {
  // console.log(id);

  const [focus, setFocus] = useState(false);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleSliderChange = (newValue: number[]) => {
    if (setOunces) setOunces(newValue);
  };

  /** api must be implemented for each individual bottle before this is relevant */
  // let timeoutId: NodeJS.Timeout | null;
  // let abortController: AbortController;

  // const handleSliderCommit = (fetchVal: number[]) => {
  //   const debouncedValues: DebounceFetchProps = {
  //     timeout: timeoutId,
  //     abort: abortController,
  //     value: { oz: fetchVal, color: color },
  //     dateKey,
  //   };
  //   debounceFetch(debouncedValues);
  // };

  return (
    <>
      <div className={`bottle-container-div ${color}`}>
        <div className='bottle-cap-div'></div>

        <div
          className={`bottle-overflow-div ${ounces[0] < 32 ? 'empty' : 'full'}`}
        ></div>

        <Slider.Root
          defaultValue={[0]}
          step={4}
          max={32}
          orientation='vertical'
          value={ounces}
          onValueChange={handleSliderChange}
          // onValueCommit={handleSliderCommit}
          onValueCommit={commitValue}
          className={`bottle-slider-root ${focus ? 'focus-glow' : ''}`}
        >
          <Slider.Track
            id='track'
            className='bottle-slider-track'
          >
            <Slider.Range
              className={`bottle-slider-range ${ounces[0] < 32 ? 'empty' : 'full'}`}
            />
          </Slider.Track>
          <Slider.Thumb
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${color} bottle-thumb-${ounces[0] === 0 ? 'empty' : ounces[0] === 32 ? 'full' : 'div'}`}
          />
        </Slider.Root>
        <p className='ounces-p'>{ounces[0]}</p>
      </div>
    </>
  );
};
