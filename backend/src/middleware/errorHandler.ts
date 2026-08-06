import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../responses/ApiResponse';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl, method: req.method });

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json(
    ApiResponse.error(
      process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
      process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
    )
  );
};
