import { ErrandProps } from '../../types/appTypes'

export const DetailDrop = ({
  id,
  name,
  complete,
  timeAssigned,
  timeExecuted,
  onDelete,
}: ErrandProps) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id)
    }
  }

  function formattedTime(str: number) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    } as const

    const formal = new Date(str).toLocaleString('en-US', options)
    const parts = formal.split(',')
    return parts[1].concat(', ', parts[0])
  }

  return (
    <>
      <div className='detail-container-divk'>
        <table className='table-b'>
          <tbody>
            <tr>
              <th>name</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>complete</th>
              <td>{String(complete)}</td>
            </tr>
            <tr>
              <th>assigned</th>
              <td className='table-time-td'>
                {formattedTime(timeAssigned || 0)}
              </td>
            </tr>
            <tr>
              <th>executed</th>
              <td className='table-time-td'>
                {timeExecuted && timeExecuted > 0
                  ? formattedTime(timeExecuted)
                  : 'TBD'}
              </td>
            </tr>
            <tr className='errand-drop-id'>
              <th>id</th>
              <td>{id}</td>
            </tr>
            {/* <tr className='errand-drop-id'></tr> */}
          </tbody>
        </table>
        <button
          className='detail-drop-delete-button'
          onClick={handleDelete}
        >
          delete
        </button>
      </div>
    </>
  )
}
