import { createEntry } from '../createEntry';

export function handleNo(callbacks?: unknown) {
  return callbacks;
}

export async function handleYes(inputDate: string) {
  const entry = createEntry([], inputDate);

  console.log('handleYes, entry: ', entry);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  };

  try {
    // TODO: create by date
    const res = await fetch(
      `http://localhost:3001/entry/${inputDate}`,
      options
    );

    console.log(res);
    if (!res.ok) {
      throw new Error('Network response is not ok.');
    }
  } catch (err) {
    console.error('Caught Error:', err);
  }
}

handleYes('2024-03-17');
// export default handlePrompt;

/**
 * //   function handledYes(inputDate) {

    //     const date: string = '2024-02-29';
    //     const onNewEntryAdd = () => console.log(date);

    //     const entry = createEntry();

    //     const options = {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(entry)
    //     }

    //     try {
    //       // TODO: create by date
    //       const res = await fetch(`http://localhost:3001/entry/${date}`, options);

    //       if (!res.ok) {
    //         throw new Error('Network response is not ok.');
    //     }

    //     // setEntryDate(newly created date);
    //     // setEntry(newly created entry);
    //   } catch(err) {
    //     console.error('Caught Error:', err);
    //   }

    //  }
 */
