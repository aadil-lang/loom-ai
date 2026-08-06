import mongoose from 'mongoose';
import { logger } from './logger';
import { env } from './env';
import { connectMemoryDB } from './memoryDb';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.warn(`Error connecting to Atlas: ${error.message}. Falling back to In-Memory DB...`);
    await connectMemoryDB();
  }
};
