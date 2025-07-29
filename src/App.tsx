import './App.css'
import { Clock } from './front/Clock/Clock'
// Main is main for entries (routines)
import Main from './front/Intended/Fix/MainEntry'
import { HydrationTracker } from './front/Hydration/HydrationTracker'
import Errands from './front/Errands/DisplayA'

function App() {
  return (
    <>
      <div>
        <div className='display-container'>
          <Clock />
          <h1>
            <a
              href='http://localhost:3001'
              rel='noopener noreferrer'
            >
              bullet-train
            </a>
          </h1>
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
