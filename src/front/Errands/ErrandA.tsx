import { useState } from 'react'
import { ErrandProps } from './createErrand'
import { DetailDrop } from './DetailDrop'

const Errand = ({
  id,
  name,
  complete,
  timeAssigned,
  timeExecuted,
  onComplete,
  onDelete,
}: ErrandProps) => {
  const [detail, setDetail] = useState(false)

  const handleToggle = () => {
    if (onComplete) {
      onComplete(id)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id)
    }
  }

  return (
    <>
      <div>
        <li
          id={id}
          className={detail === true ? 'errand-li-dropped' : 'errand-li'}
        >
          <div className='errand-checkbox-p-div'>
            <input
              type='checkbox'
              id={id}
              checked={complete}
              onChange={handleToggle}
            />
            <p
              className='errand-name-p'
              onClick={() => setDetail(!detail)}
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
            <DetailDrop
              id={id}
              name={name}
              complete={complete}
              timeAssigned={timeAssigned}
              timeExecuted={timeExecuted}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Errand
