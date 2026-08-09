import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let memoryServer;

export const connectDatabase = async () => {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== 'production',
    });

    logger.info(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    if (env.nodeEnv === 'production' || process.env.MONGODB_URI) {
      throw error;
    }

    logger.warn('Primary MongoDB connection failed; using an in-memory MongoDB instance for local development.');
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri(), {
      autoIndex: true,
    });

    logger.info(`MongoDB connected (memory server): ${mongoose.connection.name}`);
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
