import './loader.css';

export const Loader = () => {
  // while loading data on page start
  return (
    <>
      <div className='loader'>
        <div className='newton'></div>
        <div className='watch'></div>
        <div className='greenYellow'></div>
      </div>
    </>
  );
};
