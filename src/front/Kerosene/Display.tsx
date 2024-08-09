import * as Slider from '@radix-ui/react-slider';
// import Tools from './Tools';
// https://github.com/radix-ui/primitives/issues/903
import './kerosene.css';
import './keroseneStyles.css';
import { useState } from 'react';

const Kerosene = ({ color, ounces }: KeroseneBottleProps) => {
  const [piece, setPiece] = useState([0]);

  function commitValue() {
    // console.log(piece[0]);
  }
  return (
    <>
      {/* <Tools /> */}
      <Slider.Root
        // className='SliderRoot'
        className='SliderRoot bottle-slider-root'
        orientation='vertical'
        defaultValue={[0]}
        value={piece}
        onValueChange={setPiece}
        onValueCommit={commitValue}
      >
        <Slider.Track
          //  className='SliderTrack'
          className='SliderTrack bottle-slider-track'
        >
          <Slider.Range
            // className='SliderRange'
            className='SliderRange bottle-slider-range'
            asChild
          />
        </Slider.Track>
        <Slider.Thumb
          // className='SliderThumb'
          className={`SliderThumb ${color} bottle-thumb-${ounces === 32 ? 'full' : 'div'}`}
          // aria-label='Volume'
          aria-label='Water'
        />
      </Slider.Root>
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
