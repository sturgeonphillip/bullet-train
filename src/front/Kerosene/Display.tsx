import { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
import './kerosene.css';

const Display = () => {
  const [color, setColor] = useState('');
  const [ounces, setOunces] = useState([0]);

  useEffect(() => {
    // fetch initial values from backend
    fetch('/kerosene/2024-06-02')
      .then((response) => response.json())
      .then((data) => {
        setColor(data.color);
        setOunces(data.ounces);
      });
  }, []);

  function handleCommitValueData(value: number[]) {
    fetch('/kerosene/2024-06-02', {
      method: 'PATCH',
      body: JSON.stringify({ ounces: value[0] }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return (
    <>
      <Kerosene
        color={color}
        ounces={ounces}
        setOunces={setOunces}
        commitValue={handleCommitValueData}
      />
    </>
  );
};

const Kerosene = ({
  color,
  ounces,
  setOunces,
  commitValue,
}: KeroseneBottleProps) => {
  const [focus, setFocus] = useState(false);
  function handleFocusBlur(status: boolean) {
    setFocus(status);
  }

  const handleSliderChange = (value: number[]) => {
    if (setOunces) setOunces(value);
  };

  const handleValueCommit = (value: number[]) => {
    if (commitValue) commitValue(value);
  };

  return (
    <>
      <div className={`bottle-container-div ${color}`}>
        <div className='bottle-cap-div'></div>
        <div
          className={`bottle-overflow-div ${ounces[0] < 32 ? 'empty' : 'full'}`}
        ></div>

        <Slider.Root
          orientation='vertical'
          step={4}
          max={32}
          defaultValue={[0]}
          value={ounces}
          onValueChange={handleSliderChange}
          onValueCommit={handleValueCommit}
          className={`bottle-slider-root ${focus ? 'focus-glow' : ''}`}
        >
          {/* TODO: adjust className to work with data-state in css file, then apply asChild to see if it simplifies code for both Track and Range */}
          <Slider.Track className='bottle-slider-track'>
            <Slider.Range
              className={`bottle-slider-range ${ounces[0] < 32 ? 'empty' : 'full'}`}
              // asChild
            />
          </Slider.Track>
          <Slider.Thumb
            onFocus={() => handleFocusBlur(true)}
            onBlur={() => handleFocusBlur(false)}
            className={`${color} bottle-thumb-${ounces[0] === 0 ? 'empty' : ounces[0] === 32 ? 'full' : 'div'}`}
            aria-label='Water'
          />
        </Slider.Root>
        <p className='ounces-p'>{ounces[0]}</p>
      </div>
    </>
  );
};

interface KeroseneBottleProps {
  color: string;
  ounces: number[];
  setOunces: (value: number[]) => void;
  commitValue: (value: number[]) => void;
}

export default Display;

// https://github.com/radix-ui/primitives/issues/903
