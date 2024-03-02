import './App.css';
import Clock from './components/Clock';
// import RoutinesList from './components/Routines/List';
import ErrandsList from './components/Errands/List';
import ErrandsDisplay from './front/Errands/Display';

function App() {
  return (
    <>
      <div>
        <ErrandsDisplay />
        <Clock />
      </div>

      {/* <RoutinesList /> */}
      <ErrandsList />
    </>
  );
}

export default App;
