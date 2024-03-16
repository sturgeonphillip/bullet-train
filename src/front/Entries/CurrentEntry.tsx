import { useState } from 'react';
import './index.css';
import ExampleRoutine from './Example.tsx';
import { EntryProps, requestEntry } from './createEntry';

const CurrentEntry = () => {
  const [entryDate, setEntryDate] = useState('');
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [error, setError] = useState('');

  const handleEntryDate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!entryDate) {
      setError('Please select a date.');
      return; // prevent making a request with an empty date
    }

    try {
      const storedEntry = await requestEntry(entryDate);
      if (storedEntry) {
        setEntry(storedEntry);
        setError(''); // clear previous error
      } else {
        setEntry(null);
        setError('No entry found for the given date.');
      }
    } catch (err) {
      console.error('Error fetching entry:', err);
      setError('An error ocurred while fetching the entry.');
    }
  };

  return (
    <>
      <div className='ce-container-div'>
        <form onSubmit={handleEntryDate}>
          <input
            name='entry-date'
            type='date'
            id='entry-date'
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className='ce-input-date'
          />
          <button
            className='ce-btn'
            type='submit'
          >
            go
          </button>
        </form>
        {error && <p className='error-message'>{error}</p>}
        {entry && entry.routines && (
          <div>
            <ul>
              {entry.routines.map((r) => (
                <li key={r.id}>
                  <ExampleRoutine {...r} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentEntry;

/** handleEntryDate notes! */
// 1. user input changes the date
// 2. user clicks get entry submit button
// 3. this function:
/** when called:
 * the value of entryDate is used as the req params on the fetch request run by requestEntry
 * success for requestEntry: retrieves the stored data for the entry and sets it as the state using setEntry()
 * IF the date is in the future (ie today is 3/15/24 and the user inputs 6/21/24), the user is prompted with something like, "great scott, marty! we don't have any record of this date. would you like to create it?"
 * * We will need to error handle: if the user creates a future date and adds a new routine, we will need to make sure that we account for the newly added routine, as well as introducing it only on the specified date and afterward.
 * * ==> when fetching latest errands to automatically create the new entry "for tomorrow" (at change of clocks with cron job), we can retrieve errand list with most recent date that is not later than today's date. this way, if the user creates a future entry and then adds a new routine (or deletes a routine), we add the future entry to our entry database and add a key:val to our lists database {date of future entry: [array of routines as modified by user]}
 *
 */

/**
 * async function requestEntry(entryDate: string) {
    try {
      const res = await fetch(`http://localhost:3001/entry/${entryDate}`);
      if (!res.ok) {
        throw new Error('Network response error.');
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Network response error.', err);
      return null; // indicate failure
    }
  }
 */

/**
 * Phind Recs
 * Improvements and Error Handling:
 * 1. Error Handling: Added a state variable error to handle and display any errors that occur during the fetch operation. This improves the user experience by providing feedback when something goes wrong.
 * 2. Loading State: Consider adding a loading state to indicate to the user that data is being fetched. This can be done by introducing a new state variable (e.g., isLoading) and toggling it before and after the fetch operation.
 * 3. Input Validation: Before making the fetch request, validate the entryDate to ensure it's in the correct format and not empty. This can prevent unnecessary requests and improve the user experience.
 * 4. Code Organization: The handleEntryDate function is doing a lot of work. Consider breaking it down into smaller functions for better readability and maintainability. For example, you could have separate functions for fetching the entry and handling the response.
 * 5. Styling: Add CSS for the error message to make it visually distinct from the rest of the content. This can be done by adding a new class in your CSS file and applying it to the error message paragraph.
 * 6. Accessibility: Ensure that the form and its elements are accessible. For example, use aria-label attributes for inputs and buttons to provide descriptive labels for screen readers.
 * 7. Performance: If the ExampleRoutine component is complex or if there are many routines, consider implementing pagination or virtualization to improve performance.
 *
 * By implementing these improvements, you can enhance the user experience, maintainability, and performance of your CurrentEntry component.
 */
