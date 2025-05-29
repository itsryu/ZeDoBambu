import { Router } from 'express';
import { healthRouter } from './health/health.routes';

const mainRouter = Router();

mainRouter.use('/health', healthRouter);

export default mainRouter;