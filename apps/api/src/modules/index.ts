import { Router } from 'express';
import { healthRouter } from './health/health.routes';
import { authRouter } from './auth/auth.routes';
import { productRouter } from './products/product.routes';
import { userRouter } from './users/user.routes';

const mainRouter = Router();

mainRouter.use('/health', healthRouter);
mainRouter.use('/auth', authRouter);
mainRouter.use('/products', productRouter);
mainRouter.use('/users', userRouter);

export default mainRouter;