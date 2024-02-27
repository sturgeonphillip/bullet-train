import { Router } from 'express';
import * as logController from '../controllers/log.controller';

const router = Router();

router.post('/', logController.create);
router.post('/:date', logController.create);

router.get('/', logController.read);
router.get('/:date', logController.read);

router.put('/:date', logController.update);
router.delete('/:date', logController.destroy);
