import { Router } from 'express';
import { HealthController } from './health.controller';

const healthRouter = Router();
const healthController = new HealthController();

// Rotas públicas
healthRouter.get('/', healthController.checkHealth);

export { healthRouter };