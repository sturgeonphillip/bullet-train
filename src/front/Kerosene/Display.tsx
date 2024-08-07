import * as Slider from '@radix-ui/react-slider';
// import Tools from './Tools';
// https://github.com/radix-ui/primitives/issues/903
import './kerosene.css';
import { useState } from 'react';

const Kerosene = () => {
  const [piece, setPiece] = useState([0]);

  function commitValue() {
    // console.log(piece[0]);
  }
  return (
    <>
      {/* <Tools /> */}
      <Slider.Root
        className='SliderRoot'
        orientation='vertical'
        defaultValue={[0]}
        value={piece}
        onValueChange={setPiece}
        onValueCommit={commitValue}
      >
        <Slider.Track className='SliderTrack'>
          <Slider.Range
            className='SliderRange'
            asChild
          />
        </Slider.Track>
        <Slider.Thumb
          className='SliderThumb'
          aria-label='Volume'
        />
      </Slider.Root>
    </>
  );
};

export default Kerosene;
