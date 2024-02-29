import { Router } from 'express';
import * as logController from '../controllers/log.controller';

const router = Router();

// create
router.post('/', logController.create);
router.post('/:date', logController.create);

// read
router.get('/', logController.read);
router.get('/:date', logController.read);

// update
router.put('/:date', logController.update);

// delete
router.delete('/:date', logController.destroy);
