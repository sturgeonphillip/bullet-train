import './App.css';
import { Clock } from './front/Clock/Clock';
import List from './front/RoutineHistory/Display';
import { HydrationTracker } from './front/Hydration/HydrationTracker';
function App() {
  return (
    <>
      <div>
        <div className='display-container'>
          <Clock />
          <h1>bullet-train</h1>
          <hr />
          <div>
            <HydrationTracker />
          </div>
          <List />
        </div>
      </div>
    </>
  );
}

export default App;

/***
 *    Date, Time    |   Calendar Events
 *                  |
 *                  |
 * *  Water Bottles |
 * *                |
 * *                |
 * *                |     Errands
 * *  Routines      |
 * *                |
 * *                |
 * *                |
 * * Journal space:
 * - gratitude
 * - memory
 * - question
 * - conflict
 * - prayer
 *
 *
 *
 */
