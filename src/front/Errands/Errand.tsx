import './index.css';
import { ErrandProps } from './createErrand';

const Errand = ({ id, name, complete, onComplete }: ErrandProps) => {
  const handleToggle = () => {
    if (onComplete) {
      onComplete(id);
    }
  };

  return (
    <>
      <div
        id={id}
        className='errand-display-div'
      >
        <p>{name}</p>
        <input
          type='checkbox'
          id={id}
          checked={complete}
          onChange={handleToggle}
        />
      </div>
    </>
  );
};

export default Errand;
