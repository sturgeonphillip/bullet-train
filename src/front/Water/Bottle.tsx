// import { v4 as uuid } from 'uuid';
import * as Slider from '@radix-ui/react-slider';

export interface BottleProps {
  // id: string;
  name: string;
  ounces: number[];
  setOunces: (oz: number[]) => void;
}

export const Bottle = ({ name, ounces, setOunces }: BottleProps) => {
  console.log('water bottle component', name);

  return (
    <>
      <div className='bottle-container-div'>
        {/* cap */}
        <div className='bottle-cap-div'></div>

        {/* overflow */}
        <div
          className={`bottle-overflow-div + ${ounces[0] < 32 ? 'empty' : 'full'}`}
        >
          {/* `absolute z-10 mt-[15px] rounded-md block w-[70px] h-[8px] ml-[15px] border-t-2 border-l-2 bordre-r-2 border-black + ${ounces[0] < 32 ? 'bg-neutral-100' : 'bg-sky-500' } */}
        </div>

        <Slider.Root
          className='bottle-slider-root'
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
        <h4>{ounces[0]}</h4>
      </div>
    </>
  );
};
