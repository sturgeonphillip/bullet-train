type ListProps = {
  dateKey: string;
  routines: unknown[];
};

const List = ({ dateKey, routines }: ListProps) => {
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
                key={`${dateKey}-${rl as string}`}
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
