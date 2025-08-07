import './App.css'
import { Clock } from './ui/Clock/Clock'
// Main is main for entries (routines)
import Entry from './ui/Journal/Display'
import { HydrationTracker } from './ui/Hydration/HydrationTracker'
import Errands from './ui/Errands/Display'

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
            <Entry />
          </div>
        </div>
        <Errands />
      </div>
    </>
  )
}

export default App
