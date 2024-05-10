import './App.css';
import Clock from '../attic/components/Clock';

import Fix from './front/Massive/Fix/Main';
import { Loader } from './front/Loader/Loader';

function App() {
  return (
    <>
      <Clock />
      <Loader />
      <Fix />

      <hr />
      <hr />
    </>
  );
}

export default App;
