import { createEntry } from '../createEntry';
interface PromptEntryProps {
  inputDate: string;
  setEpoch: () => void;
  cleanUp: () => void;
}

const PromptEntry = ({ inputDate, setEpoch, cleanUp }: PromptEntryProps) => {
  function handleNo() {
    setEpoch();
    return cleanUp();
  }

  async function handleYes() {
    const entry = createEntry([], inputDate);

    console.log('handleYes, entry:', entry);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    };

    try {
      const res = await fetch(
        `http://localhost:3001/entry/${inputDate}`,
        options
      );

      if (!res.ok) {
        throw new Error('Network response is not ok.');
      }
    } catch (err) {
      console.error('Caught error:', err);
    }
    return cleanUp();
  }

  return (
    <>
      <p>Would you like to create an entry for {inputDate}?</p>
      <button
        className='pe-btn-yes'
        onClick={() => handleYes()}
      >
        Yes
      </button>
      <button
        className='pe-btn-no'
        onClick={() => handleNo()}
      >
        No
      </button>
    </>
  );
};

export default PromptEntry;
