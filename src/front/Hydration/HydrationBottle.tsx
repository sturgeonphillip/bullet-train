// clear
import * as Slider from '@radix-ui/react-slider';
import './hydration.css';

interface HydrationBottleProps {
  index: number;
  ounces: number;
  onChange: (oz: number) => void;
}

export const HydrationBottle = ({
  index,
  ounces,
  onChange,
}: HydrationBottleProps) => {
  // const fillRatio = ounces / 32;
  const colorClass = ['blue', 'orange', 'pink', 'green'][index % 4];

  return (
    <div className={`bottle-container-div ${colorClass}`}>
      <div className='bottle-cap-div'></div>
      {/* <div className={`bottle-overflow-div ${ounces === 32 ? 'full' : ''}`} /> */}

      {/* from bt-water */}
      <div
        className={`bottle-overflow-div + ${ounces < 32 ? 'empty' : 'full'}`}
      ></div>

      <Slider.Root
        className='bottle-slider-root'
        orientation='vertical'
        step={4}
        min={0}
        max={32}
        value={[ounces]}
        onValueChange={(v) => onChange(v[0])}
      >
        {/* <Slider.Track
          className={`bottle-slider-track ${ounces === 32 ? 'full' : ''}`}
        > */}
        {/* from bt-water */}
        <Slider.Track
          id='track'
          className='bottle-slider-track'
        >
          {/* <Slider.Range
            className={`bottle-slider-range ${ounces === 32 ? 'full' : ''}`}
            style={{ height: `${fillRatio * 100}%` }}
            /> */}

          {/* from bt-water */}
          <Slider.Range
            className={`bottle-slider-range + ${ounces < 32 ? 'empty' : 'full'}`}
          />
        </Slider.Track>
        <Slider.Thumb
          // className={
          //   `${
          //     ounces === 32
          //       ? 'bottle-thumb-full'
          //       : ounces === 0
          //         ? 'bottle-thumb-empty'
          //         : 'bottle-thumb-div'
          //   }
          //   `
          // from bt-water
          className={`${ounces === 0 ? 'bottle-thumb-empty' : ounces === 32 ? 'bottle-thumb-full' : 'bottle-thumb-div'}`}
        />
      </Slider.Root>
      <p className='ounces-p'>{ounces} oz</p>
    </div>
  );
};
