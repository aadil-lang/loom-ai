import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../errors/CustomErrors';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format error message to be cleaner
    const errorMsg = errors.array().map(e => e.msg).join(', ');
    return next(new ValidationError(errorMsg));
  }
  next();
};
