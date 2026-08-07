import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { corsConfig } from './config/cors';
import { logger } from './config/logger';
import { errorHandler } from './middleware/error/errorHandler';
// Routes
import v1Routes from './routes/v1';

import path from 'path';

export const createApp = (): Application => {
  const app = express();

  // Trust the first proxy (required when running behind Render/load balancer)
  app.set('trust proxy', 1);

  // Serve dataset images statically
  app.use('/loomai-images', express.static(path.join(__dirname, '../public/loomai-images')));

  // Middleware
  app.use(helmet());
  app.use(compression());
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
  });

  // Apply rate limiter to all routes
  app.use('/api/', limiter);
  
  // Morgan Logging tied to Winston
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );

  // Health Check
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'LoomAI API is running' });
  });

  // API Routes
  app.use('/api/v1', v1Routes);

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
