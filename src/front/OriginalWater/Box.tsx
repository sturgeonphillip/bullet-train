import { useState, useEffect } from 'react';
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
  value: number[];
  dateKey: string;
}

function isoDateKey() {
  return new Date(Date.now()).toISOString().split('T')[0];
}

function debounceTotalOz({
  timeout,
  abort,
  value,
  dateKey,
  onSuccess, // new parameter for success callback
}: DebounceFetchProps & { onSuccess: () => void }) {
  let timeoutId: NodeJS.Timeout | null = null;

  if (timeout) {
    clearTimeout(timeout);
  }

  if (abort) {
    abort.abort();
  }

  const abortController = new AbortController();

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
    signal: abortController.signal,
  };

  timeoutId = setTimeout(() => {
    fetch(`http://localhost:3001/water/${dateKey}`, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update water data.');
        }
        console.log('Successfully updated water data.');
        onSuccess(); // call the callback
      })
      .catch((err) => {
        console.error(`Error updating water data: ${err}`);
      });
  }, 2000);

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

interface SetupDebounceCallProps {
  timeout: NodeJS.Timeout | null;
  abort: AbortController | null;
  value: number[];
  dateKey: string;
  setStateFunction: (id: NodeJS.Timeout | null) => void; // function to update timout state
}

const setupDebounceAndCall = ({
  timeout,
  abort,
  value,
  dateKey,
  setStateFunction, // update the state
}: SetupDebounceCallProps) => {
  debounceTotalOz({
    timeout,
    abort,
    value,
    dateKey,
    onSuccess: () => setStateFunction(null), // reset timeout state
  });
};

const Display = () => {
  const currentDateKey = isoDateKey();
  const [blueOunces, setBlueOunces] = useState([0]);
  const [pinkOunces, setPinkOunces] = useState([0]);
  const [blueAbort, setBlueAbort] = useState<AbortController | null>(null);
  const [pinkAbort, setPinkAbort] = useState<AbortController | null>(null);
  const [blueTimeout, setBlueTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pinkTimeout, setPinkTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (blueAbort) {
        blueAbort.abort();
      }
      if (pinkAbort) {
        pinkAbort.abort();
      }
      if (blueTimeout) {
        clearTimeout(blueTimeout);
      }
      if (pinkTimeout) {
        clearTimeout(pinkTimeout);
      }
    };
  }, [blueAbort, pinkAbort, blueTimeout, pinkTimeout]);

  const handleBlueCommit = (value: number[]) => {
    setBlueOunces(value);
    setBlueAbort(new AbortController());
    setupDebounceAndCall({
      timeout: blueTimeout,
      abort: blueAbort,
      value,
      dateKey: currentDateKey,
      setStateFunction: setBlueTimeout,
    });
  };

  const handlePinkCommit = (value: number[]) => {
    setPinkOunces(value);
    setPinkAbort(new AbortController());
    setupDebounceAndCall({
      timeout: pinkTimeout,
      abort: pinkAbort,
      value,
      dateKey: currentDateKey,
      setStateFunction: setPinkTimeout,
    });
  };

  return (
    <div className='bottle-display-div'>
      <div className='bottle-group-div'>
        <Bottle
          color='blue'
          ounces={blueOunces}
          setOunces={setBlueOunces}
          commitValue={handleBlueCommit}
        />
        <Bottle
          color='pink'
          ounces={pinkOunces}
          setOunces={setPinkOunces}
          commitValue={() => handlePinkCommit}
        />
      </div>
    </div>
  );
};

const Bottle = ({ color, ounces, setOunces, commitValue }: TotalOzProps) => {
  const [focus, setFocus] = useState(false);
  const handleFocus = () => {
    setFocus(true);
  };
  const handleBlur = () => {
    setFocus(false);
  };

  return (
    <div className={`bottle-container-div ${color}`}>
      <div
        className='bottle-cap-div'
        // style={{ width: `${ounces[0]}%` }}
      />
      <div
        className={`bottle-overflow-div ${ounces[0] < 32 ? 'empty' : 'full'}`}
      />
      <Slider.Root
        orientation='vertical'
        defaultValue={[0]}
        className={`bottle-slider-root ${focus ? 'focus-glow' : ''}`}
        value={ounces}
        onValueChange={setOunces}
        onValueCommit={commitValue}
        max={32}
        step={4}
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
  );
};

export default Display;
