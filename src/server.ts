import { Server } from 'http';
import fs from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';

// const server: Server;

// TODO: validate all requests server side
import entryRoutes from './api/routes/entry.routes';
import listRoutes from './api/routes/list.routes';
import errandRoutes from './api/routes/errand.routes';
import todayRoutes from './api/routes/today.routes';
import waterRoutes from './api/routes/water.routes';
import keroseneRoutes from './api/routes/kerosene.routes';

const app = express();
const port = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const approvedOrigins = [
  'http://localhost:3001',
  'http://localhost:3001/today',
  'http://localhost:5173',
];
app.use(cors({ origin: approvedOrigins }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.static(path.resolve(__dirname, '..', 'public'), {
    extensions: ['html', 'css'],
  })
);

app.use('/entry', entryRoutes);
app.use('/list', listRoutes);
app.use('/errands', errandRoutes);
app.use('/today', todayRoutes);
app.use('/water', waterRoutes);
app.use('/kerosene', keroseneRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'main.html'));
});

app.post('/draft', async (req: Request, res: Response) => {
  try {
    const dataPath = path.join(__dirname, '../db/adjustments.json');

    let existingData = [];

    try {
      const content = await fs.readFile(dataPath, 'utf8');

      existingData = JSON.parse(content);
      console.log('EXIST', existingData);
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
    // get datapath before hitting create -> const dataPath = path.join(__dirname, '');

    await fs.writeFile(
      dataPath,
      JSON.stringify([...existingData, routine]),
      'utf8'
    );
    res.status(201).json(routine);
  } catch (error) {
    console.error('Error adding a new routine.', error);
    res.status(500).json({
      message: 'Error adding a new routine.',
      error,
    });
  }
});

const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    console.error('Error:', err);
    res.status(500).send({
      msg: 'possible CORS Error',
      detail: err.message,
    });
  } else {
    next(err);
  }
};

app.use(errorHandler);

const server: Server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT. Performing cleanup...');

  server.close(() => {
    console.log('Server closed.');
    process.exitCode = 0;
  });
});

// from MDN: Warning: Client-side form validation is no substitute for validating on the server. It's easy for someone to modify the HTML, or bypass your HTML entirely and submit the data directly to your server. If your server fails to validate the received data, disaster could strike with data that is badly-formatted, too large, of the wrong type, etc.

/**
 * let today = new Date(lapse);
 * console.log('TODAY', today, today.toISOString());
 * let justDate = today.toISOString().split('T')[0];
 * console.log('JSUT DATE', justDate);
 *
 */

/**
 * let lapse = Date.now();
 *
 * app.listen(() => {
 *   setInterval(() => {
 *     console.clear();
 *     console.log(`Server listening at http://
 *     localhost${PORT}\nIt is now: ${(lapse =
 *     Date.now())};`
 *   }, 5000);
 * });
 */
