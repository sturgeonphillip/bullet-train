import './App.css';
import { Clock } from './front/Clock/Clock';
import Water from './front/Water/Display';
import Errands from './front/Errands/Display';
import { Loader } from './front/Loader/Loader';
import Routines from './front/Intended/Fix/Main';
function App() {
  return (
    <>
      <div>
        <div>
          <Clock />
          <Water />
        </div>
        <hr />
        <Errands />
        <hr />
        <Routines />
        <Loader />
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
