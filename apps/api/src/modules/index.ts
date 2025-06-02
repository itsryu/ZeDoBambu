import { Router } from 'express';
import { healthRouter } from './health/health.routes';
import { authRouter } from './auth/auth.routes'; // ADICIONADO
// Importe outros routers aqui:
// import { productRouter } from './products/product.routes';

const mainRouter = Router();

mainRouter.use('/health', healthRouter);
mainRouter.use('/auth', authRouter); // ADICIONADO
// mainRouter.use('/products', productRouter);

export default mainRouter;