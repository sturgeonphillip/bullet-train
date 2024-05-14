import './App.css';
import { Clock } from './front/Clock/Clock';

import Fix from './front/Massive/Fix/Remain';
import { Loader } from './front/Loader/Loader';

function App() {
  return (
    <>
      <Fix />
      <hr />
      <Clock />
      <hr />
      <Loader />
    </>
  );
}

export default App;
