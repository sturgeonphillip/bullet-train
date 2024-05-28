import { useState } from 'react';
import { ErrandProps } from './createErrand';

const Errand = ({
  id,
  name,
  complete,
  timeAssigned,
  timeExecuted,
  onComplete,
  onDelete,
}: ErrandProps) => {
  const [detail, setDetail] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleToggle = () => {
    if (onComplete) {
      onComplete(id);
    }
  };

  return (
    <>
      <div>
        <li
          id={id}
          className='errand-li'
        >
          <div className='errand-li-input-div'>
            <input
              type='checkbox'
              id={id}
              checked={complete}
              onChange={handleToggle}
            />
            <p
              className='errand-name-p'
              onClick={() => setDetail(!detail)}
              style={{ cursor: 'pointer' }}
            >
              {name}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className='errand-delete-button'
          >
            x
          </button>
        </li>
        <div>
          {detail && (
            <div className='detail-container-div'>
              <p>id:</p>
              <p>{id}</p>
              <p>name:</p>
              <p>{name}</p>
              <p>complete: {complete === false ? 'false' : 'true'}</p>
              <p>timeAssigned:</p>
              <p>{timeAssigned}</p>
              <p>timeExecuted:</p>
              <p>{timeExecuted}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
