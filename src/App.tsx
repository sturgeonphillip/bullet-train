import './App.css';
import { Clock } from './front/Clock/Clock';
// import Errands from './front/Errands/Display';
// import Main from './front/Intended/Fix/Main';
import List from './front/Lists/Display';
import { History } from './front/Lists/HistoryTable-v2';
import { Loader } from './front/Loader/Loader';

function App() {
  return (
    <>
      {/* <Main /> */}
      <hr />
      <Clock />
      {/* <Errands /> */}
      <hr />
      <Loader />
      <hr />
      <History />
      <hr />

      <List />
    </>
  );
}

export default App;
