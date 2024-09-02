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
