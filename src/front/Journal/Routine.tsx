import { RoutineProps } from '../../../types/app'
const Routine = ({ id, name, complete, onComplete }: RoutineProps) => {
  const handleToggle = () => {
    if (onComplete) {
      onComplete(id)
    }
  }

  return (
    <li className='entry-routine-li'>
      <input
        type='checkbox'
        id={id}
        checked={complete}
        onChange={handleToggle}
        className='routine-checkbox'
      />
      <p className='routine-name-p'>{name}</p>
    </li>
  )
}

export default Routine
