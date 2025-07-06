import { Request, Response } from 'express';
import { isValidLogDate } from '../../utils/dateUtils';
import WaterDataService from '../../services/WaterDataService';
import { HydrationDbProps, HydrationDayProps } from '../../types/Hydration';
import { handleError } from '../../utils/errorHandler';

const waterDataService = new WaterDataService('./db/hydration.json');

// get /hydration/:date
export const getHydrationByDate = async (req: Request, res: Response) => {
  const dateKey = req.params.date;

  try {
    isValidLogDate(dateKey);

    const db: HydrationDbProps = (await waterDataService.getWaterData()) ?? {};
    const day: HydrationDayProps | undefined = db[dateKey];

    res.status(200).json({
      dateKey,
      totalOunces: day ? day.totalOunces : 0,
    });
  } catch (err) {
    handleError(err, res, 'Error retrieving hydration data.');
  }
};

// post /hydration/:date (creates with 0 oz if not present)
export const createHydrationDay = async (req: Request, res: Response) => {
  const dateKey = req.params.date;

  try {
    isValidLogDate(dateKey);

    const db: HydrationDbProps = (await waterDataService.getWaterData()) ?? {};

    if (db[dateKey]) {
      return res.status(409).json({ message: 'Log already exists.' });
    }

    db[dateKey] = { totalOunces: 0 };
    await waterDataService.saveWaterData(db);
    res.status(201).json(db[dateKey]);
  } catch (err) {
    handleError(err, res, 'Error creating hydration day.');
  }
};

// patch /hydration/:date (update totalOunces)
export const updateTotalOunces = async (req: Request, res: Response) => {
  const dateKey = req.params.date;
  const { totalOunces } = req.body;

  try {
    isValidLogDate(dateKey);
    if (typeof totalOunces !== 'number' || totalOunces < 0) {
      return res.status(400).json({ message: 'totalOunces must be >= 0.' });
    }

    const db: HydrationDbProps = (await waterDataService.getWaterData()) ?? {};
    db[dateKey] = { totalOunces };
    await waterDataService.saveWaterData(db);

    res.status(200).json(db[dateKey]);
  } catch (err) {
    handleError(err, res, 'Error updating hyration total.');
  }
};

// delete /hydration/:date (optional cleanup endpoint)
export const deleteHydrationDay = async (req: Request, res: Response) => {
  const dateKey = req.params.date;

  try {
    isValidLogDate(dateKey);

    const db: HydrationDbProps = (await waterDataService.getWaterData()) ?? {};
    if (!db[dateKey]) {
      return res.status(404).json({ message: 'Log not found.' });
    }

    delete db[dateKey];
    await waterDataService.saveWaterData(db);

    res.status(204).send();
  } catch (err) {
    handleError(err, res, 'Error deleting hydration day.');
  }
};
