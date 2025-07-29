export type RoutineHistoryListProps = {
  dateKey: string;
  routines: string[];
};

const List = ({ dateKey, routines }: RoutineHistoryListProps) => {
  return (
    <div
      id={dateKey}
      className='list-container-div'
    >
      <p className='list-p'>{dateKey}</p>
      <ul>
        {routines.length > 0
          ? routines.map((rl) => (
              <li
                key={`${dateKey}-${rl}`}
                className='list-routines-li'
              >
                {rl as string}
              </li>
            ))
          : ''}
      </ul>
    </div>
  );
};

export default List;
