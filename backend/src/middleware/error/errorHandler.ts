import { Request, Response, NextFunction } from 'express';
import { BaseCustomError } from '../../errors/CustomErrors';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

  if (err instanceof BaseCustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
