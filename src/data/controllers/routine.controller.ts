import fs from 'node:fs/promises';
import { Request, Response } from 'express';
import { handleError } from '../../utils/errorHandler';
import path, { dirname } from 'path';

/**
 * export interface RoutineProps {
 *   id: string;
 *   name: string;
 *   complete: boolean;
 *   timestamp: number;
 *   onComplete?: (id: string) => void;
 * }
 *
 * export interface RoutineListProps {
 *   date: number;
 *   routines: RoutineProps[];
 * }
 */

// new routine (not a new list)
// interface RoutineListItemProps {
//   date?: number;
//   name: string;
// };

const create = async (req: Request, res: Response, dataPath: string) => {
  try {
    let existingData = [];

    try {
      const content = await fs.readFile(dataPath, 'utf8');
      existingData = JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        existingData = [];
      } else {
        console.error(`Error reading file contents: ${error}`);
      }
    }

    const oldRoutine = existingData.at(-1).routines; // ?? [];
    const newRoutine = [...oldRoutine, req.body];
    const routine = {
      date: Date.now(),
      routines: newRoutine,
    };
    // get datapath before hitting create -> const dataPath = await path.join(__dirname, '');

    await fs.writeFile(
      dataPath,
      JSON.stringify([...existingData, routine]),
      'utf8'
    );
    res.status(201).json(routine);
  } catch (error) {
    handleError(error, res, 'Error saving routine.');
  }
};

const read = async (_req: Request, res: Response, dataPath: string) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    res.send(data);
  } catch (error) {
    handleError(error, res, `Error reading data at ${dataPath}`);
  }
};
export { create, read };

app.get('/routines', async (_req, res) => {
  const dataPath = path.join(__dirname, '../db/routines.json');
  const data = await fs.readFile(dataPath, 'utf8');
  res.send(data);
});

app.get('/routine-list', async (_req, res) => {
  const dataPath = '../db/adjustments.json';
  const data = await fs.readFile(dataPath, 'utf8');
  res.send(data);
});
