import { DisplayMissingProps } from './types';

// component active when no entry exists for input date
// asks user if they would like to create the missing entry
export const DisplayMissing = ({
  inputDate,
  handler,
  wizard,
}: DisplayMissingProps) => {
  if (wizard !== 1) {
    return null;
  }

  return (
    <>
      <h3>No entry found.</h3>
      <p>Would you like to create an entry for {inputDate}?</p>
      <button
        className='pe-btn-yes'
        onClick={() => handler(true)}
      >
        Yes
      </button>
      <button
        className='pe-btn-yes'
        onClick={() => handler(false)}
      >
        No
      </button>
    </>
  );
};
