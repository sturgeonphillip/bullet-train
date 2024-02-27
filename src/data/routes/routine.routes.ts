import { Router } from 'express';
import * as routineController from '../controllers/routine.controller';
import path from 'path';
import fs from 'node:fs/promises';

const router = Router();

router.get('/routine-list', async (_req, res) => {
  const dataPath = path.join(__dirname, '..', 'db', 'adjustments.json');
  const data = await fs.readFile(dataPath, 'utf8');
  res.send(data);
});
// app.get('/routines', async (_req, res) => {
//   const dataPath = path.join(__dirname, '../db/routines.json');
//   const data = await fs.readFile(dataPath, 'utf8');
//   res.send(data);
// });

// app.get('/routine-list', async (_req, res) => {
//   const dataPath = path.join(__dirname, '../db/adjustments.json');
//   const data = await fs.readFile(dataPath, 'utf8');
//   res.send(data);
// });

router.get('/routine-list', routineController.routineList);
