import './App.css'
import { Clock } from './front/Clock/Clock'
import Main from '../src/front/Intended/Fix/Main'
import { HydrationTracker } from './front/Hydration/HydrationTracker'
import Errands from './front/Errands/DisplayA'

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
            <Main />
          </div>
        </div>
        <Errands />
      </div>
    </>
  )
}

export default App

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
