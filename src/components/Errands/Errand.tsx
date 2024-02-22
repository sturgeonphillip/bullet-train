import { ErrandProps } from './createErrand';

const Errand = ({ id, name, complete, finished, onComplete }: ErrandProps) => {
  const handleToggle = () => {
    onComplete(id, finished);
  };

  return (
    <div>
      {name}
      <input
        type='checkbox'
        id={id}
        checked={complete}
        onChange={handleToggle}
      />
    </div>
  );
};

export default Errand;
