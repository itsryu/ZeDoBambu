import 'dotenv/config';
import './config/firebaseAdmin';
import App from './app';
import { Logger } from './utils/logger';

const startServer = async () => {
  try {
    const app = new App();
    app.listen();

    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        Logger.info(`Received ${signal}, shutting down gracefully...`, 'Process');
        process.exit(0);
      });
    });

  } catch (error) {
    const err = error as Error;
    Logger.error(`Failed to start server: ${err.message}`, 'ServerStartup');
    if (err.stack) Logger.debug(err.stack, 'ServerStartupStack');
    process.exit(1);
  }
};

process.on('uncaughtException', (error: Error) => {
  Logger.error(`Uncaught Exception: ${error.message}`, 'Process');
  if (error.stack) Logger.debug(error.stack, 'ProcessStack');
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  const err = reason as Error;
  Logger.error(`Unhandled Rejection at: ${promise}, reason: ${err.message || reason}`, 'Process');
  if (err?.stack) Logger.debug(err.stack, 'ProcessStack');
  process.exit(1);
});

startServer();