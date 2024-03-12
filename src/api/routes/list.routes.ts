import { Router } from 'express';
import * as listController from '../controllers/list.controller';

const router = Router();

router.get('/', listController.getRoutineList);

router.get('/:date', listController.getRoutineByDate);

router.post('/', listController.createRoutineList);

router.patch('/:date', listController.updateRoutineList);

router.delete('/:date', listController.destroyRoutineList);

export default router;
