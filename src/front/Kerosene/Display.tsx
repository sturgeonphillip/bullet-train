import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
// import Tools from './Tools';
// https://github.com/radix-ui/primitives/issues/903
import './kerosene.css';

const Kerosene = ({
  color,
  ounces,
  setOunces,
  commitValue,
}: KeroseneBottleProps) => {
  const [piece, setPiece] = useState([0]);
  const [focus, setFocus] = useState(false);

  return (
    <>
      <div className={`bottle-container-div ${color}`}>
        <div className='bottle-cap-div'></div>
        <div
          className={`bottle-overflow-div ${ounces < 32 ? 'empty' : 'full'}`}
        ></div>

        <Slider.Root
          // className='SliderRoot'
          className={`bottle-slider-root ${focus ? 'focus-glow' : ''}`}
          // orientation='vertical'
          defaultValue={[0]}
          value={piece}
          onValueChange={setPiece}
          onValueCommit={commitValue}
        >
          <Slider.Track
            //  className='SliderTrack'
            className='bottle-slider-track'
          >
            <Slider.Range
              asChild
              className={`bottle-slider-range ${ounces < 32 ? 'empty' : 'full'}`}
            />
          </Slider.Track>
          <Slider.Thumb
            // onFocus={handleFocus}
            // onBlur={handleBlur}
            // className={`${color} bottle-thumb-${ounces === 32 ? 'full' : 'div'}`}
            className={`${color} bottle-thumb-${ounces === 0 ? 'empty' : ounces === 32 ? 'full' : 'div'}`}
            // aria-label='Volume'
            aria-label='Water'
          />
        </Slider.Root>
        <p className='ounces-p'>{ounces}</p>
      </div>
    </>
  );
};

export default Kerosene;

interface KeroseneBottleProps {
  color: string;
  ounces: number;
  setOunces: (value: number) => void;
  commitValue: (value: number[]) => void;
}
