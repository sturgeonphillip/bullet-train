function handleListPrompt(choices: string[][]): string[] {
    const a = choices[0];
    const b = choices[1];
    if (a) {
      return a;
    } else {
      return b;
    }
  }

  async function handleEntryPrompt(verdict: boolean) {
    if (verdict === true) {
      console.log('yes!');

      const checkList = await findAppropriateRoutineList(entryDate);

      if (checkList.length > 1) {
        setShowEntryPrompt(false);
        setShowListPrompt(true);
        // prompt user checkList[0] || checkList[1]
        routinesToUse = await handleListPrompt(checkList);
        setShowListPrompt(false);
      } else {
        if (checkList) {
          routinesToUse = checkList[0];
        }
      }

      const entry = createEntry(routinesToUse, entryDate);

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      };

      try {
        const res = await fetch(
          `http://localhost:3001/entry/${entryDate}`,
          options
        );
        if (!res.ok) {
          throw new Error('Network response not ok.');
        }

        // after creating entry, fetch again to ensure latest data
        const createdEntry = await fetchEntry();
        setEntry(createdEntry);
      } catch (err) {
        console.error(
          `Caught error while trying to create entry for ${entryDate}. ${err}`
        );
      }
    } else {
      console.log('no entry will be created.');
    }

    setShowEntryPrompt(false);
  }

  export handleEntryPrompt;
