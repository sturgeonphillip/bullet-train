import { DisplayListOptionProps } from './types';

// component active after user confirms to create missing entry
// asks user which list to use to populate it
export const DisplayListOption = ({
  inputDate,
  candidates,
  wizard,
  setWizard,
}: DisplayListOptionProps) => {
  if (wizard !== 2) {
    return null;
  }

  const [before, after] = candidates;

  console.log('input', inputDate, 'sW', setWizard, 'b', before, 'a', after);
  // function chooseList()
};
