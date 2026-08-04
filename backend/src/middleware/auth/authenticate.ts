import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../errors/CustomErrors';
import { TokenService } from '../../services/auth/TokenService';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const payload = TokenService.verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    next(new UnauthorizedError('Access token is expired or invalid'));
  }
};
