import { Router } from 'express';
import * as errandController from '../controllers/errand.controller';

const router = Router();

router.get('/', errandController.getErrands);

router.get('/:id', errandController.getErrand);

router.post('/', errandController.createErrand);

router.patch('/:id', errandController.updateErrand);

router.delete('/:id', errandController.destroyErrand);

export default router;
