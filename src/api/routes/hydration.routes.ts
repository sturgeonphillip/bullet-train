import { Router } from 'express';
import * as hydration from '../controllers/hydration.controller';

const router = Router();

router.get('/:date', hydration.getHydrationByDate);
router.post('/:date', hydration.createHydrationDay);
router.patch('/:date', hydration.updateTotalOunces);
router.delete('/:date', hydration.deleteHydrationDay);

export default router;
