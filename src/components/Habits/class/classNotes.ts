/**
 * Habits are measured:
 * day of record
 * * that day's list of habits (names)
 * * * those habits' complete status
 */
/**
 * Habit
 *
 * {
 *  "id": "0f0551af-7e6f-480b-a03c-ac6e162abc86",
 *  "name": "pray",
 *  "complete": false,
 *  // "onComplete?": (id: string) => void; //
 * }
 *
 */

/**
 * HabitList
 * {
 *  Does it make sense to store the list of the habits as a separate list?
 * It might make more sense to add properties that show when a habit was started and ended by putting a prop on an individual habit
 *
 * the list could be something that just tracks changes?
 *  changes = {
 *  '2024-02-23': [ 'row', 'pray', 'code' ],
 *  '2024-03-01': [ 'row', 'pray', 'code', 'apply' ],
 * }
 *
 * const mostRecent = Object.keys(changes).at(-1);
 *
 */

/**
 * DailyHabits
 *
 * {
 *  "date": 1708639951838,
 *  "habits": [
 *    {
 *     "id": "0f0551af-7e6f-480b-a03c-ac6e162abc86",
 *     "name": "pray",
 *     "complete": false,
 *     // "onComplete?": (id: string) => void; //
 *    }
 * *    {
 *     "id": "0f0551af-7e6f-480b-a03c-ac6e162abc86",
 *     "name": "pray",
 *     "complete": false,
 *     // "onComplete?": (id: string) => void; //
 *    }
 * *    {
 *     "id": "0f0551af-7e6f-480b-a03c-ac6e162rrw86",
 *     "name": "row",
 *     "complete": false,
 *     // "onComplete?": (id: string) => void; //
 *    }
 * *    {
 *     "id": "0f234Rdd-7e6f-480b-a03c-ac6e162abc43",
 *     "name": "code",
 *     "complete": false,
 *     // "onComplete?": (id: string) => void; //
 *    }
 *
 *   ]
 * }
 */

// so if STATE is a list of habits...
// * we need to track the list of habits independent of a Habit's other data
// * the DailyHabits class needs a way to add a habit to an existing list of habits.
// * how many other functions are needed?

/**
 * KISS
 * right now it is probably best to just create a function that adds the new habit to the array and starts it on the same day.
 * considering how the list of habits will be
 */

// ** we could add a specific prompt that will ask when to start the habit.  we'll have to add it to stored data.
// {
//   "futureHabits": [
//     { "name": "cook dinner",
//       "dateToBegin": "February 9, 2024"
//     }
//   ]
// }

/**
 *
 * useful methods to have on the class:
 * * addHabit
 * * getHabits
 * * getHabitsByName
 * * resetHabitDate (if we track the time of completion, this would be used to make sure if something is accidentally marked complete and then unchecked, we won't have a stale date mixed up with an incomplete habit)
 *
 * Either separately or together, these two would be used at the end of the day so that tomorrow has a fresh instance of the habits list. The day ends, the data is updated in the db, then the date changes to tomorrow and the habits are all incomplete.
 * * resetDate
 * * resetHabits
 * *
 * *
 * * a way to change something about a previous date
 *
 * from the original class, how and in what use case would these be useful?
 * * sortHabitsProperties ?
 * * setDate ?
 * * markAllComplete ?
 * * getDate ?
 */
