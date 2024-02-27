import { Response } from 'express';

export const handleError = (
  error: unknown,
  res: Response,
  message: string = 'An error occured.'
) => {
  console.error(message, error);
  res.status(500).json({
    message,
    error,
  });
};
