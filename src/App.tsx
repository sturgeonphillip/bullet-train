import './App.css';
import Clock from '../attic/components/Clock';

import Fix from './front/Massive/Fix/Main';
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
