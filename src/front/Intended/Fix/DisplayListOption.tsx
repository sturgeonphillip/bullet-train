// import { DisplayListOptionProps } from './types';

// // component active after user confirms to create missing entry
// // asks user which list to use to populate it
// export const DisplayListOption = ({
//   inputDate,
//   candidates,
//   wizard,
//   setWizard,
// }: DisplayListOptionProps) => {
//   if (wizard !== 2) {
//     return null;
//   }

//   const [before, after] = candidates;

//   console.log('input', inputDate, 'sW', setWizard, 'b', before, 'a', after);
//   // function chooseList()
// };

import { DisplayListOptionProps, WizardState } from './types'

const DisplayListOption = ({
  inputDate,
  candidates,
  wizard,
  setWizard,
  onCreateEntry,
}: DisplayListOptionProps) => {
  if (wizard !== WizardState.LIST_OPTIONS) {
    return null
  }

  const { before, after } = candidates

  const handleSelectList = (routines: string[]) => {
    onCreateEntry(routines)
    setWizard(WizardState.SHOW_ENTRY)
  }

  const handleCreateEmpty = () => {
    onCreateEntry([])
    setWizard(WizardState.SHOW_ENTRY)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div>
      <h3>Create Entry for {formatDate(inputDate)}</h3>
      <p>Choose a template to start with:</p>

      <div className='list-options'>
        {before.practices.length > 0 && (
          <div className='option-card'>
            <h3>Use list from {formatDate(before.date)}</h3>
            <ul className='task-preview'>
              {before.practices.slice(0, 3).map((practice, index) => (
                <li key={index}>{practice}</li>
              ))}
              {before.practices.length > 3 && (
                <li>... and {before.practices.length - 3} more</li>
              )}
            </ul>
            <button
              className='pe-btn-option'
              onClick={() => handleSelectList(before.practices)}
            >
              Use This List ({before.practices.length} items)
            </button>
          </div>
        )}
        {after.practices.length > 0 && (
          <div className='option-card'>
            <h3> Use list from {formatDate(after.date)}</h3>
            <ul className=''>
              {after.practices.slice(0, 3).map((practice, index) => (
                <li key={index}>{practice}</li>
              ))}
              {after.practices.length > 3 && (
                <li>... and {after.practices.length - 3} more</li>
              )}
            </ul>
            <button
              className='pe-btn-option'
              onClick={() => handleSelectList(after.practices)}
            >
              Use This List ({after.practices.length} items)
            </button>
          </div>
        )}
      </div>

      <div className='option-card'>
        <h3>Start Fresh</h3>
        <h4>Begin with a Blank Entry and Add Routines Manually</h4>
        <button
          className='pe-btn-option'
          onClick={handleCreateEmpty}
        >
          Use a Blank Entry
        </button>
      </div>

      <button
        className='pe-btn-cancel'
        onClick={() => setWizard(WizardState.SHOW_ENTRY)}
      >
        Cancel
      </button>
    </div>
  )
}

export default DisplayListOption
