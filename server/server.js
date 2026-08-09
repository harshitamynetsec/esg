import http from 'http';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();
const server = http.createServer(app);

const shutdown = async (signal) => {
  logger.info(`${signal} received, shutting down`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

try {
  await connectDatabase();
  server.listen(env.port, () => {
    logger.info(`ESG-NSS API listening on port ${env.port}`);
  });
} catch (error) {
  logger.error('Server startup failed', { error: error.message, stack: error.stack });
  process.exit(1);
}
