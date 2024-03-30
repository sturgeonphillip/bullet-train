interface PromptEntryProps {
  inputDate: string;
  showEpoch?: () => void;
  handler: (verdict: boolean) => void;
  cleanUp?: () => void;
}

type ChoicesType = string[][];
interface PromptListProps {
  entryDate: string;
  choices: ChoicesType;
  handler: (choices: string[]) => string[];
}
const PromptEntry = ({ inputDate, handler }: PromptEntryProps) => {
  // const PromptEntry = ({ inputDate, cleanUp }: PromptEntryProps) => {

  return (
    <>
      <p>No data found.</p>
      <p>Would you like to create an entry for {inputDate}?</p>
      <button
        className='pe-btn-yes'
        onClick={() => handler(true)}
      >
        Yes
      </button>
      <button
        className='pe-btn-no'
        onClick={() => handler(false)}
      >
        No
      </button>
    </>
  );
};

export const PromptList = ({
  entryDate,
  choices,
  handler,
}: PromptListProps) => {
  const [a, b] = choices;
  return (
    <div>
      <p>
        The two dates closest to {entryDate} are different. Choose a list of
        routines to use for this new entry.
      </p>
      <button
        className='pe-btn-before'
        onClick={() => handler(a)}
      >
        Before
      </button>
      <button
        className='pe-btn-after'
        onClick={() => handler(b)}
      >
        After
      </button>
    </div>
  );
};
export default PromptEntry;
