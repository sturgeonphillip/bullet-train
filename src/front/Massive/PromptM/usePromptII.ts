import { useState } from 'react';

type ListProps = { [dateKey: string]: string[] };
type RoutineListProps = [string, string[]];

function usePrompt(props) {
  const { promptCarriage } = props;

  const [showEntryPrompt, setShowEntryPrompt] = useState(true);
  const [showListPrompt, setShowListPrompt] = useState(false);
  const [routineChoices, setRoutineChoices] = useState<RoutineListProps[]>([]);
  const [routinesToUse, setRoutinesToUse] = useState<string[]>([]);

  function handleNextPrompt() {
    setShowListPrompt(true);
    setShowEntryPrompt(false);
  }

  async function handleEntryPrompt(verdict: boolean) {
    if (verdict === true) {
      console.log('yes! now, we might switch to list prompt.');

      // should add a loading state/suspender here
      const checkList: RoutineListProps[] =
        await findAppropriateRoutineList(entryDate);

      if (checkList.length > 1) {
        // list choices presented to the user
        setRoutineChoices(checkList);
        // when the user picks a or b, it's set as routinesToUse
        if (routineChoices.length > 0) {
          handleRoutineSelection(routineChoices[0]);
        }
      } else {
        if (checkList) {
          setRoutinesToUse(checkList[1][1]);
        }
      }

      // const entry = createEntry(routinesToUse, entryDate);
      /** POST Request to put entry into db
       * after creating the entry, we fetch again to set the
       * newly created entry to be the currently displayed entry
       * GET Request to show entry
       *
       */

      setShowEntryPrompt(false);
    }
  }

  function handleRoutineSelection(routines: RoutineListProps): void {
    setRoutinesToUse(routines[1]);
  }

  return {
    routinesToUse,
    handleNextPrompt,
    showEntryPrompt,
    showListPrompt,
    handleEntryPrompt,
  };
}

export default usePrompt;

function bookendDates(allLists: number[], dateMatch: number) {
  const before = allLists.reduce((latestBefore, current) => {
    if (current <= dateMatch && current > latestBefore) {
      return current;
    }
    return latestBefore;
  });

  const after = allLists.reduce((earliestAfter, current) => {
    if (current >= dateMatch && current < earliestAfter) {
      return current;
    }
    return earliestAfter;
  });

  return [before, after];
}

function listWithKey(num: number, routineLists: ListProps) {
  const key = new Date(num).toISOString().split('T')[0];
  return [key, routineLists[key]];
}

async function findAppropriateRoutineList(dateMatch: string) {
  const routineList = [];
  const match = new Date(dateMatch).getTime();

  try {
    const res = await fetch(`http://localhost:3001/list/`);
    const json = await res.json();

    // TODO: move sorting to server side so fetched json is always presorted
    const orderedDates = Object.keys(json)
      .map((x) => new Date(x).getTime())
      .sort((a, b) => a - b);

    const [before, after] = bookendDates(orderedDates, match);

    if (before !== after) {
      routineList.push(listWithKey(before, json));
      routineList.push(listWithKey(after, json));
    } else {
      routineList.push(listWithKey(before, json));
    }
  } catch (err) {
    console.error(`Error while fetching findAppropriateRoutineList: ${err}`);
  }

  return routineList;
}
