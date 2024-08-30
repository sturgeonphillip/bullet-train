import { useState, useCallback } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface WaterBottleDisplayProps {
  color?: string;
  ounces: number[];
  setOunces: (value: number[]) => void;
  commitValue: (value: number[]) => void;
}

const WaterBottle = ({
  color,
  ounces,
  setOunces,
  commitValue,
}: WaterBottleDisplayProps) => {
  const [focus, setFocus] = useState(false);

  color = 'blue';

  function handleFocusBlur(status: boolean) {
    setFocus(status);
  }

  const handleSliderChange = useCallback(
    (value: number[]) => {
      console.log('handleSliderChange...', value);
      setOunces(value);
    },
    [setOunces]
  );

  const handleValueCommit = useCallback(
    (value: number[]) => {
      console.log('handleValueCommit...', value);
      commitValue(value);
    },
    [commitValue]
  );

  return (
    <>
      <div className={`bottle-container-div ${color}`}>
        <div className='bottle-cap-div'></div>
        <div
          className={`bottle-overflow-div ${ounces[0] < 32 ? 'empty' : 'full'}`}
        ></div>

        <Slider.Root
          orientation='vertical'
          step={2}
          max={32}
          defaultValue={[0]}
          value={ounces}
          onValueChange={handleSliderChange}
          onValueCommit={handleValueCommit}
          className={`bottle-slider-root ${focus ? 'focus-glow' : ''}`}
        >
          <Slider.Track className='bottle-slider-track'>
            <Slider.Range
              className={`bottle-slider-range ${ounces[0] < 32 ? 'empty' : 'full'}`}
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

export default WaterBottle;
