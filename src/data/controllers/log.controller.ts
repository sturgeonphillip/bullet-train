import { Request, Response } from 'express';
import fs from 'node:fs/promises';
import { handleError } from '../../utils/errorHandler';

const create = async (req: Request, res: Response, dataPath: string) => {
  // how does this handle a newly initialized log? needs to create {} upon start

  try {
    let existingData = [];

    try {
      const content = await fs.readFile(dataPath, 'utf8');
      existingData = await JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        existingData = [];
      } else {
        console.error(`Error reading file content: ${error}`);
      }
    }

    const pastRoutine = existingData.at(-1).routines;
    const futureRoutine = [...pastRoutine, req.body];
    const routine = {
      date: Date.now(),
      routines: futureRoutine,
    };
    await fs.writeFile(
      dataPath,
      JSON.stringify([...existingData, routine]),
      'utf8'
    );

    res
      .status(201)
      .json({ message: 'New routine added to log.', data: routine });
  } catch (error) {
    handleError(error, res, 'Error saving routine.');
  }
};

const read = async (_req: Request, res: Response, dataPath: string) => {
  try {
    // adjust to handle req.body that will show a specific date entry
    const data = await fs.readFile(dataPath, 'utf8');
    res.send(data);
  } catch (err) {
    handleError(err, res, `Error reading data at ${dataPath}`);
  }
};

const update = async (req: Request, res: Response, dataPath: string) => {
  // log/:date -> adjust the log entry for a specific date to show that routines started (or will start on a different date than currently saved)
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    // find correct entry
    const record = await data[req.body];

    if (!record) {
      return res.status(404).json({ message: 'Log record not found.' });
    }

    // await modify record
    const newRecord = { message: 'modified' };
    res.status(200).json(newRecord);
  } catch (err) {
    handleError(err, res, `Error while modifying record.`);
  }
};

const destroy = async (req: Request, res: Response, dataPath: string) => {
  // handle destroying entire log (in which case the log is reset to {} without any routines)
  // needs to handle /log/:date to remove a change in routines // TODO: how to handle inconsistencies if entries have data for a routine but the log record does not show that routine as part of the list
  try {
    const data = await fs.readFile(dataPath, 'utf8');

    // find specific record
    const record = await data[req.body];
    if (!record) {
      return res.status(404).json({ message: `Log record not found.` });
    }

    // await destroy record

    res.status(200).json({ message: `Log record destroyed successfully.` });
  } catch (err) {
    res.status(500).json({ message: `Error deleting log record.`, err });
  }
};

export { create, read, update, destroy };
