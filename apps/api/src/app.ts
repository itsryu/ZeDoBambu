import express from 'express';
import cors from 'cors';
import config from './config/index';
import { Logger } from './utils/logger';
import { errorHandlerMiddleware } from './core/middlewares/errorHandler.middleware';
import { notFoundMiddleware } from './core/middlewares/notFound.middleware';
import mainRouter from './modules/index';

class App {
  public express: express.Express;

  constructor() {
    this.express = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    Logger.info('Middlewares initialized.', 'AppSetup');
  }

  private initializeRoutes(): void {
    this.express.use('/api/v1', mainRouter);
    Logger.info('Routes initialized with prefix /api/v1.', 'AppSetup');
  }

  private initializeErrorHandling(): void {
    this.express.use(notFoundMiddleware);
    this.express.use(errorHandlerMiddleware);
    Logger.info('Error handling initialized.', 'AppSetup');
  }

  public listen(): void {
    this.express.listen(config.port, () => {
      Logger.info(
        `API Server is running at ${config.localUrl}:${config.port}/api/v1`,
        'ServerStartup'
      );
      Logger.info(`Current environment: ${config.nodeEnv}`, 'ServerStartup');
    });
  }
}

export default App;