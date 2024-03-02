import { ErrandProps } from './createErrand';

const Errand = ({ id, name, complete, onComplete }: ErrandProps) => {
  const handleToggle = () => {
    if (onComplete) {
      onComplete(id);
    }
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
