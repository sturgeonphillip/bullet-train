interface PromptEntryProps {
  inputDate: string;
  handler: (verdict: boolean) => void;
}
const PromptEntry = ({ inputDate, handler }: PromptEntryProps) => {
  // function handleYes() {
  //   return;
  // }
  // function handleNo() {
  //   return;
  // }

  return (
    <>
      <div>
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
      </div>
    </>
  );
};

export default PromptEntry;
