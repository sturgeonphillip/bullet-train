// component active when no entry exists for input date
// asks user if they would like to create the missing entry
import { DisplayMissingProps } from '../../types/app'
import { WizardStateEnum } from '../../types/enums'
const DisplayMissing = ({
  inputDate,
  handler,
  wizard,
}: DisplayMissingProps) => {
  if (wizard !== WizardStateEnum.MISSING_ENTRY) {
    return null
  }

  return (
    <div>
      <h3>No entry found.</h3>
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
  )
}

export default DisplayMissing
