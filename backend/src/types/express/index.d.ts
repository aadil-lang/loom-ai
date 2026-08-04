import { TokenPayload } from '../../services/auth/TokenService';

declare global {
  namespace Express {
    export interface Request {
      user?: TokenPayload;
    }
  }
}
