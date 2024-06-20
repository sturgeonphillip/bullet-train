import { Router } from 'express';

import * as waterController from '../controllers/water.controller';

const router = Router();

router.get('/', waterController.getWaterRecords);

router.get('/:date', waterController.getWaterRecordByDate);

router.post('/:date', waterController.createWaterRecord);

router.patch('/:date', waterController.updateWaterRecords);

router.delete('/:date', waterController.destroyWaterRecord);

export default router;
