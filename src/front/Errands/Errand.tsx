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
      <li
        id={id}
        className='errand-li'
      >
        <input
          type='checkbox'
          id={id}
          checked={complete}
          onChange={handleToggle}
        />
        <p className='errand-name-p'>{name}</p>
      </li>
    </>
  );
};

export default Errand;
