import './App.css';
import { Clock } from './front/Clock/Clock';
import Water from './front/Water/Display';
import { Loader } from './front/Loader/Loader';

function App() {
  return (
    <>
      <Clock />
      <hr />
      <Water />
      <hr />

      <Loader />
      <hr />
    </>
  );
}

export default App;
