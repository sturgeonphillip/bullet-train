const PromptList = ({ handler }) => {
  const [before, after] = routines;
  return (
    <>
      <div>
        <div>
          <p>
            The list of routines from {before} is the most rcent list prior to{' '}
            {inputDate}, and the earliest after it is from {after}.
          </p>
          <p>Choose a list of routines to use for this new entry.</p>
          <button
            className='pl-btn-before'
            onClick={() => handler(before)}
          >
            Before
          </button>
          <button
            className='pl-btn-before'
            onClick={() => handler(before)}
          >
            Before
          </button>
        </div>
        <hr />
        <h1> -- OR -- </h1>
        <div>
          <p>
            Which of these routine lists would you like to use to initialize the
            entry?
          </p>

          <div className='choices-container'>
            <div className='choices-section'>
              <button
                className='pl-btn'
                onClick={() => handler()}
              >
                <h3>{before[0]}</h3>
                <ul>
                  {before[1].map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </button>
            </div>

            <div className='choices-section'>
              <button
                className='pl-btn'
                onClick={() => handler()}
              >
                <h3>{after[0]}</h3>
                <ul>
                  {after[1].map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </button>
            </div>

            <div className='choices-section'>
              <button
                className='pl-btn'
                onClick={() => handler()}
              >
                Create the entry for <p>{inputDate}</p> without any routines.
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromptList;
