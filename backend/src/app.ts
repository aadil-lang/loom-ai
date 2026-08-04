import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsConfig } from './config/cors';
import { logger } from './config/logger';
import { errorHandler } from './middleware/error/errorHandler';
// Routes
import v1Routes from './routes/v1';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
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
