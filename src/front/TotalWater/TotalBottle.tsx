import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { TotalOzProps } from './totalWaterProps';

const Bottle = ({ color, ounces, setOunces, commitValue }: TotalOzProps) => {
  const [focus, setFocus] = useState(false);

  const handleFocus = () => {
    setFocus(true);
  };
  const handleBlur = () => {
    setFocus(false);
  };

  const handleSliderChange = (newValue: number[]) => {
    if (setOunces) setOunces(newValue[0]);
  };

  return (
    <>
      <div className={`bottle-container-div ${color}`}>
        <div className='bottle-cap-div'></div>

        <div
          className={`bottle-overflow-div ${ounces < 32 ? 'empty' : 'full'}`}
        ></div>

        <Slider.Root
          defaultValue={[0]}
          step={4}
          max={32}
          orientation='vertical'
          value={[ounces]}
          onValueChange={handleSliderChange}
          onValueCommit={commitValue}
          className={`bottle-slider-root ${focus ? 'focus-glow' : ''}`}
        >
          <Slider.Track
            id='track'
            className='bottle-slider-track'
          >
            <Slider.Range
              className={`bottle-slider-range ${ounces < 32 ? 'empty' : 'full'}`}
            />
          </Slider.Track>
          <Slider.Thumb
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${color} bottle-thumb-${ounces === 32 ? 'full' : 'div'}`}
          />
        </Slider.Root>
        <p className='ounces-p'>{ounces}</p>
      </div>
    </>
  );
};

// interface TotalOzProps {
//   color: string;
//   ounces: number;
//   setOunces: (value: number) => void;
//   commitValue: (value: number[]) => void;
// }

export default Bottle;
