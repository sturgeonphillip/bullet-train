import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

const approvedOrigins = ['http://localhost:3001', 'http://localhost:5173'];

app.use(
  cors({
    origin: approvedOrigins,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());
app.use(
  express.static(path.resolve(__dirname, '..', 'public'), {
    extensions: ['html', 'css'],
  })
);
// app.use(express.static(path.resolve(__dirname, '..', '/public/')));

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'main.html'));
});

app.get('/errands', (req, res) => {
  const dataPath = path.join(__dirname, './data/errands.json');
  const data = fs.readFileSync(dataPath, 'utf8');
  res.send(data);
});

app.post('/list', (req, res) => {
  try {
    const { id, dateAdded, dateCompleted, name, complete } = req.body;
    console.log('ERRAND', id, dateAdded, dateCompleted, name, complete);
    res.status(200).json({ message: 'Errand saved.' });
  } catch (error) {
    console.error('Error on server at endpoint: /list', error);
  }
});

app.post('/errands', async (request, response) => {
  try {
    await response.status(200).json({ message: 'Errand saved.' });
  } catch (err) {
    console.error('Error saving errands: ', err);
  }
});

app.use((err, req, res, next) => {
  if (err instanceof Error) {
    res.status(500).send({ msg: 'CORS Error', detail: err.message });
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
