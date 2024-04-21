import './App.css';
import Clock from '../attic/components/Clock';
// import ErrandsDisplay from './front/Errands/Display';
// import ListDisplay from './front/Lists/Display';
// import Massive from './front/Massive/RewriteMassive';
import MainPage from './front/Massive/MainPage/MainPage';

function App() {
  return (
    <>
      <Clock />
      {/* <Massive /> */}
      <MainPage />
      <hr />

      <div
        id='display-container'
        className='display-container'
      >
        <div className='display'>{/* <ListDisplay /> */}</div>
        <div className='display'>{/* <ErrandsDisplay /> */}</div>
      </div>
    </>
  );
}

export default App;
