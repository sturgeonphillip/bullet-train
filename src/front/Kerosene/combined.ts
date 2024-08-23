import { isoDateKey } from '../../utils/dateKey';
import { v4 as uuid } from 'uuid';

// Create a bottle with default properties
export function createBottle(): BottleProps {
  return {
    id: uuid(),
    ounces: [0],
    capacity: 32,
    complete: false,
  };
}

// Create a water metric with default properties
export function createWaterMetric(
  bottles: BottleProps[] = []
): WaterMetricProps {
  if (bottles.length <= 0) {
    const empty = createBottle();
    bottles.push(empty);
  }

  return {
    gauge: 0,
    timestamp: Date.now(),
    ounces: bottles.reduce((acc, crv) => acc + crv.ounces[0], 0),
    bladders: bottles.length,
    bottles,
  };
}

// create a water log base with drefauult properties
export function createWaterLogBase(date: string): WaterLogProps {
  return {
    date,
    metrics: [
      createWaterMetric([
        createBottle(),
        createBottle(),
        createBottle(),
        createBottle(),
      ]),
    ],
  };
}

// create a new log for a consecutive day
export function createLog(): WaterLogProps {
  const today = isoDateKey();
  return createWaterLogBase(today);
}

// create a new log for a nonconsecutive day
export function createNonconsecutiveLog(date: string): WaterLogProps {
  return createWaterLogBase(date);
}

// create a log entry with partial metrics
export function createLogWithPartialMetrics({
  date = isoDateKey(),
  metrics = [],
}: Partial<WaterLogProps> = {}): WaterLogProps {
  const processedMetrics = metrics.map((metric) => {
    // ensure each metric has at least one bottle
    if (!metric.bottles || metric.bottles.length === 0) {
      metric.bottles = [createBottle()];
    }

    return {
      ...metric,
      gauge: metric.gauge || 0,
      timestamp: metric.timestamp || Date.now(),
      ounces: metric.ounces || 0,
      bladders: metric.bottles.length,
      bottles: metric.bottles || [createBottle()],
    };
  });

  // if no metrics are provided, create a default metric with a single bottle
  if (processedMetrics.length === 0) {
    processedMetrics.push({
      gauge: 0,
      timestamp: Date.now(),
      ounces: 0,
      bladders: 1,
      bottles: [createBottle()],
    });
  }

  return {
    date,
    metrics: processedMetrics,
  };
}

export interface BottleProps {
  id: string;
  ounces: number[];
  capacity: number;
  complete: boolean;
  color?: string;
}

export interface WaterMetricProps {
  gauge: number;
  timestamp: number;
  ounces: number;
  bladders: number;
  bottles: BottleProps[];
}

export interface WaterLogProps {
  date: string;
  metrics: WaterMetricProps[];
}

// export function createWaterLogWithPartial({
//   date = isoDateKey(),
//   metrics = [],
// }: Partial<WaterLogProps> = {}) {
//   const processedMetrics = metrics.map((metric) => {
//     // ensure each metric has at least one bottle
//     if (!metric.bottles || metric.bottles.length === 0) {
//       metric.bottles = [createBottle()];
//     }

//     return {
//       ...metric,
//       gauge: metric.gauge || 0,
//       timestamp: metric.timestamp || Date.now(),
//       ounces: metric.ounces || 0,
//       bladders: metric.bottles.length, // quantity of bottles
//       bottles: metric.bottles || [createBottle()],
//     };
//   });

//   // if no metrics are provided, create a default metric with a single bottle
//   if (processedMetrics.length === 0) {
//     processedMetrics.push({
//       gauge: 0,
//       timestamp: Date.now(),
//       ounces: 0,
//       bladders: 1,
//       bottles: [createBottle()],
//     });
//   }

//   return {
//     date,
//     metrics: processedMetrics,
//   };
// }

// export function createWaterLogBase({
//   date = isoDateKey(),
//   metrics,
// }: Partial<WaterLogProps> = {}) {
//   return {
//     date,
//     metrics: metrics || [],
//   };
// }

// export function createWaterLog(props: Partial<WaterLogProps> = {}) {
//   return createWaterLogBase({
//     ...props,
//     metrics: [createWaterMetric([createBottle()])],
//   });
// }

// export function createNonconsecutiveWaterLog(
//   props: Partial<WaterLogProps> = {}
// ) {
//   return createWaterLogBase(props);
// }

/**
 * before refactoring the code, consider that these functions will be needed to help display data to the user as well as for api endpoints.
 * on the ui, we start with 4 empty bottles that the user fills as they drink water. ie, drink 6 ounces, move the ui to show the bottle is now 6 ounces fuller. when the onscreen bottles are full, the user has completed their daily goal.
 * in the data, we want to save the ounces drank, not the ounces left to drink. if the user's bottle capacity is 32 oz and our ui shows that the user drank 28 oz, we want to store 28 oz (not 4 oz remaining). 
 * we can create functions that will keep us DRY, like creating a water log base if there's a lot of repetitive code.
 * the purpose of our functions are to create daily water log entries.
our default 'day' has 4 bottles, each with a 32 oz capacity and all of the bottles are full, meaning that [ounces] matches capacity and complete is false.
each day the water totals are empty. we need:
1. a function that will create a new log entry at the start of each day.
ex: today is 2024-08-22. when the clock strikes midnight, we need a function that will create a new log entry for 2024-08-23 with the bottles all empty, the ounces at 0, the completes all set to false.
2. a function that will allow us to create a new log entry for a nonconsecutive day. if for some reason there's a day from the past that didn't record (like 2024-06-29) but I know how much water i drank that day, i should be able to call this function with an argument for the date.
3. a function that can create log entries with only partial metrics (like we do in the create log with partial function).

as stated, if any of these functions can be combined, go for it, but let's make sure it's clear enough so that we can separate the functions for our different endpoints.
 */

/**
 * what is the best pattern of logic to follow when creating an app?
 *
 * our app helps a user to track the amount of water they drink each day. if the user's goal is to drink 128 oz each day and the user has 4 32 oz bottles, we can display 4 bottles on screen and the user can adjust the amount of water in each bottle throughout the day as they drink.
 * the data is json stored by date. the metrics object is an array of snapshots captured each time the user updates the water they drank.
 *
 * {
 *  "2024-07-03": {
 *    date: `date`, // saved as property for ease of lookup
 *    metrics: [
 *      {
 *        gauge: 0, // matches the nth snapshot update (each day starts at 0, 1st update is 1, 2nd is 2, so the last update (most recent) is metrics.length - 1)
 *        timestamp: // Date.now() for time of update,
 *        ounces: // total ounces is bottles.reduce(acc, crv => acc + crv.ounces, 0),
 *        bladders: 4,
*        bottles: [
*         {
*           id: string using uuid library, 
*           ounces: x of `capacity`,
*           capacity: 32,
*           complete: (finished drinking or not),
*           color: string (optional property if the user wants to give it a nickname)
*         }
*        ]
 *      },
 *      {}
 *    ]
 *  }
 * }
 *
 * And so, the questions about in the relationship between storing the data and displaying it to the user in the ui.
 * 
 * should we start the day with 4 bottles that appear to be full because there's no water drank yet, or should we show the bottles empty and have the user's updates slowly fill the bottles so that once the user drinks 128 oz of water they have 4 bottles that are now full of water?
 * 
 * when it comes to storing the data, is it best to show the ounces properties (on the metric and on each bottle) to be the water left to drink, or the water already drank? It feels like this could go either way and the data could quickly become confusing. an example of the problem reading the data would be when a user doesn't know if they already drank 18 oz or they still need to drink 18 oz.
 * 
 * i have a hunch that there might be a common best practice. what do you know?
 * 
 * 
export interface BottleProps {
  id: string;
  ounces: number[];
  capacity: number;
  complete: boolean;
  color?: string;
}

export interface WaterMetricProps {
  gauge: number;
  timestamp: number;
  ounces: number;
  bladders: number;
  bottles: BottleProps[];
}

export interface WaterLogProps {
  date: string;
  metrics: WaterMetricProps[];
}

 */
