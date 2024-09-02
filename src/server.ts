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
import { handleError } from './utils/errorHandler';

// TODO: validate all requests server side
import entryRoutes from './api/routes/entry.routes';
import listRoutes from './api/routes/list.routes';
import errandRoutes from './api/routes/errand.routes';
import todayRoutes from './api/routes/today.routes';
import keroseneRoutes from './api/routes/kerosene.routes';

const app = express();
const port = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};

app.use(cors(corsOptions));

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
app.use('/kerosene', keroseneRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'main.html'));
});

app.post('/draft', async (req: Request, res: Response) => {
  try {
    const dataPath = path.join(__dirname, '../db/drafts.json');

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

const errorHandlerMiddleware = (
  err: ErrorRequestHandler,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if ('message' in err && typeof err.message === 'string') {
    handleError(err.message, res);
    // if (typeof err.message === 'string') {
    //   handleError(err.message ?? 'An unknown error occurred', res);
  } else {
    handleError('An unknown error occured', res);
  }
  handleError(err, res);
  next(err); // call next with the error to propagate it to the next middleware
};

app.use(errorHandlerMiddleware);

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
