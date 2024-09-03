import { useCallback, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import './kerosene.css';

interface WaterBottleProps {
  color: string;
  ounces: number[];
  onOuncesChange: (value: number[]) => void;
  onCommit: (value: number[]) => void;
}

const WaterBottle = ({
  color,
  ounces = [0], // set default value as an array with a single element
  onOuncesChange,
  onCommit,
}: WaterBottleProps) => {
  const [focus, setFocus] = useState(false);

  const handleSliderChange = useCallback(
    (value: number[]) => {
      onOuncesChange(value);
    },
    [onOuncesChange]
  );

  const handleValueCommit = useCallback(
    (value: number[]) => {
      onCommit(value);
    },
    [onCommit]
  );

  return (
    <div className={`bottle-container-div ${color}`}>
      <div className='bottle-cap-div'></div>
      <div
        className={`bottle-overflow-div ${ounces[0] < 32 ? 'empty' : 'full'}`}
      ></div>

      <Slider.Root
        orientation='vertical'
        step={2}
        max={32}
        value={ounces}
        onValueChange={handleSliderChange}
        onValueCommit={handleValueCommit}
        className={`bottle-slider-root ${focus ? 'focus-glow' : ''}`}
      >
        <Slider.Track className={`bottle-slider-track`}>
          <Slider.Range
            className={`bottle-slider-range ${ounces[0] < 32 ? 'empty' : 'full'}`}
          />
        </Slider.Track>
        <Slider.Thumb
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          // TODO: when the bottle is hovered, show the thumb (aka focus glow)
          className={`${color} bottle-thumb-${ounces[0] === 0 ? 'empty' : ounces[0] === 32 ? 'full' : 'div'}`}
          aria-label='Water'
        />
      </Slider.Root>
      <p className={'ounces-label'}>{ounces[0]}</p>
    </div>
  );
};

export default WaterBottle;
