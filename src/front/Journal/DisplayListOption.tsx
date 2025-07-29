import { DisplayListOptionProps, WizardStateEnum } from '../../../types/app'

const DisplayListOption = ({
  inputDate,
  candidates,
  wizard,
  setWizard,
  onCreateEntry,
}: DisplayListOptionProps) => {
  if (wizard !== WizardStateEnum.LIST_OPTIONS) {
    return null
  }

  const { before, after } = candidates

  const handleSelectList = (routines: string[]) => {
    onCreateEntry(routines)
    setWizard(WizardStateEnum.SHOW_ENTRY)
  }

  const handleCreateEmpty = () => {
    onCreateEntry([])
    setWizard(WizardStateEnum.SHOW_ENTRY)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div>
      <h3>Create Entry for {formatDate(inputDate)}</h3>
      <p>Choose a template to start with:</p>

      <div className='list-options'>
        {before.routines.length > 0 && (
          <div className='option-card'>
            <h3>Use list from {formatDate(before.date)}</h3>
            <ul className='task-preview'>
              {before.routines.slice(0, 3).map((routine, index) => (
                <li key={index}>{routine}</li>
              ))}
              {before.routines.length > 3 && (
                <li>... and {before.routines.length - 3} more</li>
              )}
            </ul>
            <button
              className='pe-btn-option'
              onClick={() => handleSelectList(before.routines)}
            >
              Use This List ({before.routines.length} items)
            </button>
          </div>
        )}
        {after.routines.length > 0 && (
          <div className='option-card'>
            <h3>Use list from {formatDate(after.date)}</h3>
            <ul className=''>
              {after.routines.slice(0, 3).map((routine, index) => (
                <li key={index}>{routine}</li>
              ))}
              {after.routines.length > 3 && (
                <li>... and {after.routines.length - 3} more</li>
              )}
            </ul>
            <button
              className='pe-btn-option'
              onClick={() => handleSelectList(after.routines)}
            >
              Use This List ({after.routines.length} items)
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
        onClick={() => setWizard(WizardStateEnum.SHOW_ENTRY)}
      >
        Cancel
      </button>
    </div>
  )
}

export default DisplayListOption
