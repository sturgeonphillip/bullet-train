import './App.css';
import Clock from '../attic/components/Clock';
import RoutineDisplay from './front/Routines/Display';
import ErrandsDisplay from './front/Errands/Display';
import ListDisplay from './front/Lists/Display';

function App() {
  return (
    <>
      <Clock />
      <div
        id='display-container'
        className='display-container'
      >
        <div className='display'>
          <RoutineDisplay />
          <ListDisplay />
        </div>
        <div className='display'>
          <ErrandsDisplay />
        </div>
      </div>
    </>
  );
}

export default App;
