import { Router } from 'express';

import * as entryController from '../controllers/entry.controller';

const router = Router();

router.get('/', entryController.getEntries);

router.get('/:date', entryController.getEntry);

router.post('/', entryController.createEntry);

router.patch('/:date', entryController.updateEntry);

// router.patch('/:date/:id', entryController.updateEntryRoutine);

router.delete('/:date', entryController.destroyEntry);

/** not needed, sort of redundant with the benefits of updating state via hooks on the client */
// router.get('/:date/:id', entryController.getEntryRoutine);

// router.get('/:date/:id', entryController.getEntryRoutine);

// update the status of a routine on this day's entry

// remove a routine from the entry
// router.delete('/:date/:id', entryController.destroyEntryRoutine);

export default router;
