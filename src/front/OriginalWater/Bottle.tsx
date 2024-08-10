import { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
// import { debounceFetch, DebounceFetchProps } from './debounceTotalOz';

interface TotalOzProps {
  color: string;
  ounces: number[];
  setOunces: (value: number[]) => void;
  commitValue: (value: number[]) => void;
}

export const Bottle = ({
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

  useEffect(() => {
    console.log('Original Water Update:', ounces[0]);
  }, [ounces]);

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
