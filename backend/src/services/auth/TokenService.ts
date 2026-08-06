import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt';
import crypto from 'crypto';

export interface TokenPayload {
  id: string;
  role: string;
}

export class TokenService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    } as jwt.SignOptions);
  }

  static generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.secret) as TokenPayload;
  }
}
