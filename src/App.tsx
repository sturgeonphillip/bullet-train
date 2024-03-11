import './App.css';
import Clock from '../attic/components/Clock';
import RoutineDisplay from './front/Routines/Display';
import ErrandsDisplay from './front/Errands/Display';

function App() {
  return (
    <>
      <div>
        <RoutineDisplay />
        <Clock />
        <ErrandsDisplay />
      </div>
    </>
  );
}

export default App;
