import { Router } from 'express';

import * as keroseneController from '../controllers/kerosene.controller';

const router = Router();

router.get('/', keroseneController.getFullWaterLog);

router.get('/:date', keroseneController.getLog);

router.get('/:date/:id', keroseneController.getLogByBottle);

router.post('/:date', keroseneController.createLog);

router.patch('/:date', keroseneController.updateLog);

router.delete('./:date', keroseneController.destroyLog);

export default router;
