import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { logger } from '../config/logger';

// Seed modules will be imported here
// import { seedBuyers } from './buyers';
// import { seedProducts } from './products';

const runSeeder = async () => {
  logger.info('Starting database seeding...');
  await connectDB();

  try {
    // await seedBuyers();
    // await seedProducts();
    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Database seeding failed', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

if (require.main === module) {
  runSeeder();
}
