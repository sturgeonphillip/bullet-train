export interface BottleProps {
  id: string;
  ounces: number[];
  setOunces: (oz: number[]) => void;
  totalOunces: number;
  dateKey?: string;
}

export const Bot = ({
  id,
  ounces,
  setOunces,
  totalOunces,
  dateKey,
}: BottleProps) => {
  const color = `bottle-${id}`;

  let debounceTimer: NodeJS.Timeout;

  const debounceFetch = (val: number) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      console.log(`fetch request w/ value: ${val}`);

      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(totalOunces),
      };

      (async () => {
        await fetch(`http://localhost:3001/water/${dateKey}`, options);
      })();
    }, 1500);
  };

  const handleSliderChange = (nv: number) => {
    setOunces([nv]);

    debounceFetch(nv);
  };

  return (
    <>
      <h1>DOGS!</h1>
    </>
  );
};
