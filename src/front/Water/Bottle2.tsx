import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

export interface BottleProps {
  dateKey?: string;
  id: string;
  ounces: number[];
  setOunces: (oz: number[]) => void;
}

export const Bottle2 = ({ id, ounces, setOunces, dateKey }: BottleProps) => {
  // TODO judge impact of removing 'bottle-' from color='bottle-id'
  const color = `${id}`;

  const [focus, setFocus] = useState(false);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };
  /**
  let debounceTimer: NodeJS.Timeout | null = null;

  const debounceFetch = (value: number) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      console.log(`Fetch request with value:`, value);

      const reqBody = {
        ounces: value,
        color,
      };

      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      };

      fetch(`http://localhost:3001/water/${dateKey}`, options)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to update water data.');
          }
          console.log(
            `Successfully updated water data: ${JSON.stringify(reqBody)}`
          );
        })
        .catch((err) => {
          console.error(`Error updating water data: ${err}`);
        });
    }, 1500);
  };
 */

  let timeoutId: NodeJS.Timeout | null = null;
  let abortController: AbortController | null = null;

  const debounceFetch = (value: number) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (abortController) {
      abortController.abort(); // cancel previous request
    }
    abortController = new AbortController();

    const reqBody = {
      ounces: value,
      color,
    };

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
      signal: abortController.signal, // pass signal to fetch request
    };

    timeoutId = setTimeout(() => {
      fetch(`http://localhost:3001/water/${dateKey}`, options)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to update water data.');
          }
          console.log(
            `Successfully updated water data: ${JSON.stringify(reqBody)}`
          );
        })
        .catch((err) => {
          console.error(`Error updating water data: ${err}`);
        });
    }, 500);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  };

  const handleSliderChange = (newValue: number[]) => {
    setOunces(newValue);
    debounceFetch(newValue[0]);
  };

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
