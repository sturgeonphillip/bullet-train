import { WizardStateEnum } from '../../types/enums'
import DisplayEntry from './DisplayEntry'
import DisplayMissing from './DisplayMissing'
import DisplayListOption from './DisplayListOption'

const RenderWizard = () =>
  // loading?: unknown, // React.SetStateAction,
  // wizard?: unknown, // React.SetStateAction
  // entry
  // entry
  {
    if (loading) {
      return <div className='loading'>Loading...</div>
    }

    switch (wizard) {
      case WizardStateEnum.SHOW_ENTRY:
        return (
          <DisplayEntry
            inputDate={entryDate}
            entry={entry}
            wizard={wizard}
            setEntry={setEntry}
          />
        )

      case WizardStateEnum.MISSING_ENTRY:
        return (
          <DisplayMissing
            inputDate={entryDate}
            handler={handleMissingEntry}
            wizard={wizard}
          />
        )

      case WizardStateEnum.LIST_OPTIONS:
        return adjacentLists ? (
          <DisplayListOption
            inputDate={entryDate}
            candidates={adjacentLists}
            wizard={wizard}
            setWizard={setWizard}
            onCreateEntry={handleCreateEntry}
          />
        ) : null

      default:
        return null
    }
  }

export default RenderWizard
