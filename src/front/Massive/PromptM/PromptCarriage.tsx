import { useState } from 'react';

const PromptCarriage = (carriage: string) => {
  const [showEntryPrompt, setShowEntryPrompt] = useState(true);
  const [showListPrompt, setShowListPrompt] = useState(false);

  function handlePrompts() {
    setShowEntryPrompt(!showEntryPrompt);
    setShowListPrompt(!showListPrompt);
  }

  console.log(`Action coming from ${carriage}!`);
  return (
    <>
      {showEntryPrompt && (
        <div>
          <button onClick={() => handlePrompts()}>Entry/List</button>
          <h2>Entry</h2>
          <h3>PromptEntry Data</h3>
        </div>
      )}
      <hr />
      {showListPrompt && (
        <div>
          <h2>List</h2>
          <h3>PromptList Data</h3>
          <button onClick={() => handlePrompts()}>List/Entry</button>
        </div>
      )}
    </>
  );
};

export default PromptCarriage;

/**
 * Logic brainstorm:
 * Previously: in MassiveEntry if the input is set to a new date without an entry, it triggered PromptEntry, which had a boolean question.
 * Yes -> create a new entry. No -> do nothing.
 * Now, we have PromptCarriage. We want the same thing, but the yes should lead us to prompt the list.
 * Yes -> useState should hide the PromptEntry and (maybe) show PromptList.
 * No -> redirect user back to today by way of useState for entry.
 */
