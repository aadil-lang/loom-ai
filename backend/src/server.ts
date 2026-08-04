import { createApp } from './app';
import { connectDB } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Initialize App
    const app = createApp();

    // 3. Start Server
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });

    // Handle Unhandled Rejections
    process.on('unhandledRejection', (err: Error) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
