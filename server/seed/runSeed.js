import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { seedDatabase } from './seedData.js';

try {
  await connectDatabase();
  const result = await seedDatabase();
  logger.info('Seed data completed', result);
  await disconnectDatabase();
  process.exit(0);
} catch (error) {
  logger.error('Seed data failed', { error: error.message, stack: error.stack });
  await disconnectDatabase();
  process.exit(1);
}
