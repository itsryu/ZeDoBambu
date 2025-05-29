import mongoose from 'mongoose';
import config from './index';
import { Logger } from '@/utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    Logger.info('MongoDB Connected successfully.', 'Database');

    mongoose.connection.on('error', (err) => {
      Logger.error(`MongoDB connection error: ${err.message}`, 'Database');
    });

    mongoose.connection.on('disconnected', () => {
      Logger.warn('MongoDB disconnected.', 'Database');
    });

  } catch (error) {
    const err = error as Error;
    Logger.error(`MongoDB connection failed: ${err.message}`, 'Database');
    
    if (err.stack) Logger.debug(err.stack, 'DatabaseStack');
    process.exit(1);
  }
};