import './App.css';
import Clock from './components/Clock';
import RoutinesList from './components/Routines/List';
import ErrandsList from './components/Errands/List';

function App() {
  return (
    <>
      <div>
        <Clock />
      </div>

      <RoutinesList />
      <ErrandsList />
    </>
  );
}

export default App;
