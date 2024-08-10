import './App.css';
import { Clock } from './front/Clock/Clock';
import Water from './front/OriginalWater/Display';
import Kerosene from './front/Kerosene/Display';

function App() {
  return (
    <>
      <div>
        <div>
          <Clock />
          <hr />
          <div className='holding'>
            <h4>Original</h4>
            <Water />
          </div>
          <div className='holding'>
            <h4>Kerosene!</h4>
            <Kerosene />
          </div>
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
