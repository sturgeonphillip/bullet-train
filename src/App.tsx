import './App.css';
import { Clock } from './front/Clock/Clock';
import Errands from './front/Errands/Display';
import { Water } from './front/Water/Bottle';
// import Main from './front/Intended/Fix/Main';
// import List from './front/Lists/Display';

// import { HistoryColumn } from './front/Lists/HistoryColumn/HistoryColumn';
// import { HistoryRow } from './front/Lists/HistoryRow/HistoryRow';
import { Loader } from './front/Loader/Loader';

function App() {
  return (
    <>
      <Clock />
      <hr />
      <Water />
      <hr />

      {/* <Main /> */}
      {/* 
      // {/* <Errands /> */}
      {/* <hr /> */}
      {/* <HistoryColumn /> */}
      {/* <HistoryRow /> */}

      {/* <List /> */}
      <Loader />
      <Errands />
      <hr />
    </>
  );
}

export default App;
