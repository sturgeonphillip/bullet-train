import * as Slider from '@radix-ui/react-slider';

export interface BottleProps {
  dateKey?: string;
  id: string;
  color: string;
  ounces: number[];
  setOunces: (oz: number[]) => void;
}

export const Bottle = ({
  id,
  ounces,
  setOunces,
  // dateKey
}: BottleProps) => {
  const color = `bottle-${id}`;
  // console.log(dateKey);

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
          defaultValue={[0]}
          step={4}
          max={32}
          orientation='vertical'
          value={ounces}
          onValueChange={setOunces}
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
            className={`${color} bottle-thumb-${ounces[0] === 0 ? 'empty' : ounces[0] === 32 ? 'full' : 'div'}`}
          />
        </Slider.Root>
        <p className='ounces-p'>{ounces[0]}</p>
      </div>
    </>
  );
};
