import { Router } from 'express';

import * as keroseneController from '../controllers/kerosene.controller';

const router = Router();

router.get('/', keroseneController.getAllWaterLogRecords);

router.get('/:date', keroseneController.getWaterLogByDate);

router.get('/:date/:gauge', keroseneController.getGaugeFromLogByDate);

router.post('/:date', keroseneController.createWaterLogForNewDate);

router.patch('/:date', keroseneController.updateWaterLog);

router.delete('./:date', keroseneController.destroyWaterLog);

export default router;

// const updateWaterLog = async (req: Request, res: Response) => {
//   const logDate = req.params.date;
//   const { index, value } = req.body;

//   try {
//     const waterData = await waterDataService.getWaterData();

//     if (!waterData) {
//       throw new Error('Unable to retrieve data from the database.');
//     }

//     if (!waterData[logDate]) {
//       await createWaterLogForNewDate(req, res);
//     } else {
//       const currentMetrics = waterData[logDate].metrics;
//       const latestMetric = currentMetrics[currentMetrics.length - 1];

//       // update the specific bottle
//       latestMetric.bottles[index].ounces = value;
//       latestMetric.bottles[index].complete =
//         value[0] >= latestMetric.bottles[index].capacity;

//       // recalculate total ounces
//       const totalOunces = latestMetric.bottles.reduce(
//         (acc: number, bottle: BottleProps) => acc + bottle.ounces[0],
//         0
//       );

//       // create a new WaterMetricsProps object
//       const newMetric: WaterMetricsProps = {
//         gauge: currentMetrics.length,
//         timestamp: Date.now(),
//         ounces: totalOunces,
//         bladders: latestMetric.bottles.length,
//         bottles: [...latestMetric.bottles], // copy the bottles array
//       };

//       // push the new metric onto the metrics array
//       currentMetrics.push(newMetric);

//       await waterDataService.saveWaterData(waterData);

//       res.status(200).json(waterData[logDate]);
//     }
//   } catch (err) {
//     handleError(err, res, 'Error fettching or creating a water log.');
//   }
// };
