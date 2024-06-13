import React, { useEffect, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
export interface BottleProps {
  id: string;
  ounces: number[];
  setOunces: (oz: number[]) => void;
  overflowRef: React.RefObject<HTMLDivElement>;
  thumbRef: React.RefObject<HTMLDivElement>;
}

export const Bottle2 = ({
  id,
  ounces,
  setOunces,
  overflowRef,
  thumbRef,
}: BottleProps) => {
  const color = `bottle-${id}`;

  const [isThumbFocused, setIsThumbFocused] = useState(false);

  useEffect(() => {
    const currentThumbRef = thumbRef.current;

    const handleFocusBlur = () => {
      setIsThumbFocused(currentThumbRef === document.activeElement);
    };

    if (currentThumbRef) {
      currentThumbRef.addEventListener('focus', handleFocusBlur);
      currentThumbRef.addEventListener('blur', handleFocusBlur);

      return () => {
        currentThumbRef.removeEventListener('focus', handleFocusBlur);
        currentThumbRef.removeEventListener('blur', handleFocusBlur);
      };
    }
  }, [thumbRef]);

  // determine if overflow div is 'full' based on logic
  const isOverflowFull = true; // placeholder

  // conditionally apply styles based on state
  const overflowStyle =
    isThumbFocused && isOverflowFull
      ? { backgroundColor: 'var(--thumb-aquatic)' }
      : {};

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
          className=''
          defaultValue={[0]}
          step={4}
          max={32}
          orientation='vertical'
          value={ounces}
          onValueChange={setOunces}
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
      <div
        ref={overflowRef}
        className='bottle-overflow-div full'
        style={overflowStyle}
      ></div>
      <div
        ref={thumbRef}
        className='bottle-thumb-div'
      ></div>
    </>
  );
};
