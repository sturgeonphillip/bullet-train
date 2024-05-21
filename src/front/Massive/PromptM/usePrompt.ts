import { useState } from 'react';

type ListProps = { [dateKey: string]: string[] };
type RoutineListProps = [string, string[]];
type RoutineChoiceProps = [before: RoutineListProps, after?: RoutineListProps];

function usePrompt(entryDate: string) {
  const [showEntryPrompt, setShowEntryPrompt] = useState(true);
  const [showListPrompt, setShowListPrompt] = useState(false);
  const [routineChoices, setRoutineChoices] = useState<RoutineChoiceProps>([
    [new Date().toISOString().split('T')[0], []],
  ]);
  const [routinesToUse, setRoutinesToUse] = useState<string[]>([]);

  function handleNextPrompt() {
    setShowListPrompt(true);
    setShowEntryPrompt(false);
  }

  async function handleEntryPrompt(verdict: boolean): Promise<void> {
    if (verdict === true) {
      console.log('yes! now, we might switch to list prompt.');

      const checkList: RoutineChoiceProps =
        await findAppropriateRoutineList(entryDate);

      if (checkList.length > 1) {
        setRoutineChoices(checkList);
        if (routineChoices.length > 0) {
          handleRoutineSelection(routineChoices[0]);
        }
      } else {
        if (checkList.length > 0) {
          setRoutinesToUse(checkList[0][1]);
        }
      }
    }
    if (verdict === false) {
      // fetch entry for today's date
    }
    setShowEntryPrompt(false);
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
    handleRoutineSelection,
  };
}

export default usePrompt;

function bookendDates(allLists: number[], dateMatch: number): [number, number] {
  const before = allLists.reduce((latestBefore, current) => {
    if (current <= dateMatch && current > latestBefore) {
      return current;
    }
    return latestBefore;
  }, 0);

  const after = allLists.reduce((earliestAfter, current) => {
    if (current >= dateMatch && current < earliestAfter) {
      return current;
    }
    return earliestAfter;
  }, Number.MAX_SAFE_INTEGER);

  return [before, after];
}

function listWithKey(num: number, routineLists: ListProps): RoutineListProps {
  const key = new Date(num).toISOString().split('T')[0];
  return [key, routineLists[key] || []];
}

async function findAppropriateRoutineList(
  dateMatch: string
): Promise<RoutineChoiceProps> {
  const routineList: RoutineChoiceProps = [
    [new Date().toISOString().split('T')[0], []],
  ];
  const match = new Date(dateMatch).getTime();

  try {
    const res = await fetch(`http://localhost:3001/list/`);
    const json: ListProps = await res.json();

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
