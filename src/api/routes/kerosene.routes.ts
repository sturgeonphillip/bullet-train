import { Router } from 'express';

import * as keroseneController from '../controllers/kerosene.controller';

const router = Router();

router.get('/', keroseneController.getWaterLog);

router.get('/:date', keroseneController.getLogByDate);

router.get('/:date/:gauge', keroseneController.getGaugeByDate);

router.post('/:date', keroseneController.createLogByDate);

router.patch('/:date', keroseneController.updateWaterLog);

router.delete('./:date', keroseneController.destroyWaterLog);

export default router;
