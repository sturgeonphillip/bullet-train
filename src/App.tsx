// import './App.css';
// // import { Clock } from './front/Clock/Clock';
// import Water from './front/Water/Display';
// // import Errands from './front/Errands/Display';
// // import { Loader } from './front/Loader/Loader';
// // import Routines from './front/Intended/Fix/Main';

// function App() {
//   return (
//     <>
//       <div>
//         <div>
//           {/* <Clock /> */}
//           <Water />
//         </div>
//         {/* <Errands /> */}
//         <hr />
//         {/* <Routines /> */}
//         {/* <Loader /> */}
//       </div>
//     </>
//   );
// }

// export default App;

// import { useEffect } from 'react';
import './App.css';
import { Clock } from './front/Clock/Clock';
import Water from './front/Water/Display';
import {
  useElementLogger,
  // logAllChildElements,
} from './utils/useElementLogger';

function App() {
  useElementLogger();

  // // useEffect(() => {
  // //   // select all elements in document
  // //   console.log('selected!');
  // //   const allElements = document.querySelectorAll('*');

  // //   const parent = Array.from(allElements).find((element) => {
  // //     return element.className.includes('bottle');
  // //   });

  // //   if (parent) {
  // //     logAllChildElements(parent as HTMLElement);
  // //   }
  // // }, []);

  return (
    <>
      <div>
        <div>
          <Clock />
          <Water />
        </div>
      </div>
    </>
  );
}

export default App;

/***
 *    Date, Time    |   Calendar Events
 *                  |
 *                  |
 * *  Water Bottles |
 * *                |
 * *                |
 * *                |     Errands
 * *  Routines      |
 * *                |
 * *                |
 * *                |
 * * Journal space:
 * - gratitude
 * - memory
 * - question
 * - conflict
 * - prayer
 *
 *
 *
 */
