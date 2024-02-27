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

const app = express();
const port = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const approvedOrigins = ['http://localhost:3001', 'http://localhost:5173'];

app.use(
  cors({
    origin: approvedOrigins,
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(
  express.static(path.resolve(__dirname, '..', 'public'), {
    extensions: ['html', 'css'],
  })
);

app.use(express.json());

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'main.html'));
});

app.get('/errands', async (_req, res) => {
  const dataPath = path.join(__dirname, '..', 'db', 'errands.json');
  const data = await fs.readFile(dataPath, 'utf8');
  res.send(data);
});

app.get('/habits', (_req, res) => {
  const dataPath = path.join(__dirname, './data/habits.json');
  const data = fs.readFile(dataPath, 'utf8');
  res.send(data);
});

// app.get('/routines', async (_req, res) => {
//   const dataPath = path.join(__dirname, '../db/routines.json');
//   const data = await fs.readFile(dataPath, 'utf8');
//   res.send(data);
// });

app.get('/routine-list', async (_req, res) => {
  const dataPath = path.join(__dirname, '../db/adjustments.json');
  const data = await fs.readFile(dataPath, 'utf8');
  res.send(data);
});

app.post('/errands', async (req, res) => {
  try {
    const dataPath = await path.join(__dirname, './data/errands.json');
    const errands = JSON.parse(await fs.readFile(dataPath, 'utf8'));

    await fs.writeFile(
      dataPath,
      JSON.stringify([...errands, req.body]),
      'utf8'
    );
    res.status(201).json({ message: 'Errand saved.' });
  } catch (err) {
    console.error('Error saving errands: ', err);
    res.status(500).json({ message: 'Error saving errand', error: err });
  }
});

app.post('/routineList', async (req, res) => {
  try {
    const dataPath = await path.join(__dirname, '../db/adjustments.json');

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
    // get datapath before hitting create -> const dataPath = await path.join(__dirname, '');

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

app.delete('/errands/:id', async (req, res) => {
  const idToDelete = await req.params.id;

  try {
    const dataPath = path.join(__dirname, './data/errands.json');
    const errands = JSON.parse(await fs.readFile(dataPath, 'utf8'));

    const updatedErrands = errands.filter(
      (errand: { id: string }) => errand.id !== idToDelete
    );

    await fs.writeFile(dataPath, JSON.stringify(updatedErrands), 'utf8');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error saving errands: ', err);
      res.status(500).json({
        message: 'Error deleting errand',
        error: err.message,
      });
    }
  }
});

app.use(
  (error: Error, _req: Request, res: Response, next: NextFunction): void => {
    if (error instanceof Error) {
      res.status(500).send({
        msg: 'possible CORS Error',
        detail: error.message,
      });
    } else {
      next(error);
    }
  }
);

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  // (error: Error, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof Error) {
    res.status(500).send({
      msg: 'possible CORS Error',
      detail: err.message,
    });
  } else {
    next(err);
  }
  // }
};

app.use(errorHandler);
let lapse = Date.now();
lapse;
app.listen(port, () => {
  setInterval(() => {
    console.clear();
    console.log(
      `Server listening at http://localhost:${port}; \nIt is now: ${(lapse = Date.now())};`
    );
  }, 5000);
});
