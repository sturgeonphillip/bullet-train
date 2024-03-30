import './App.css';
import Clock from '../attic/components/Clock';
// import RoutineDisplay from './front/Routines/Display';
import ErrandsDisplay from './front/Errands/Display';
import ListDisplay from './front/Lists/Display';
// import CurrentEntry from './front/Entries/Entry';
import MassiveEntry from './front/Massive/MassiveEntry';

function App() {
  return (
    <>
      <Clock />
      {/* <CurrentEntry /> */}
      {/* <RoutineDisplay /> */}
      <MassiveEntry />
      <hr />

      <div
        id='display-container'
        className='display-container'
      >
        <div className='display'>
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
