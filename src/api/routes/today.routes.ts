import { Router } from 'express';
import * as todayController from '../controllers/entryControllers/today.controller';

const router = Router();

router.get('/', todayController.handleToday);

export default router;
