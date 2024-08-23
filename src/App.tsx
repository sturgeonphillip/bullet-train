import './App.css';
import { Clock } from './front/Clock/Clock';
import Water from './front/OriginalWater/Box';
import BlackBottle from './front/Kerosene/BlackboxII';

function App() {
  return (
    <>
      <div>
        <div className='display-container'>
          <Clock />
          <hr />
          <div className='holding'>
            <h4>Original</h4>
            {/* <Water /> */}
          </div>
          {/* <div className='holding'>
            <h4>Kerosene!</h4>
            <Kerosene />
          </div> */}
          <div className='holding'>
            <h4>Black Bottle</h4>
            <BlackBottle />
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
