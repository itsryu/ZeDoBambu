import { Router } from 'express';
import { UserController } from './user.controller';
import { isAuthenticated, isAdmin } from '../../core/middlewares/auth.middleware';

const userRouter = Router();
const controller = new UserController();

// Rotas públicas
userRouter.get('/me', isAuthenticated, controller.getProfile);
userRouter.put('/me', isAuthenticated, controller.updateProfile);

// Rotas para administradores
userRouter.get('/', isAuthenticated, isAdmin, controller.getAll);
userRouter.get('/:id', isAuthenticated, isAdmin, controller.getProfile);
userRouter.put('/:id', isAuthenticated, isAdmin, controller.adminUpdate);
userRouter.put('/:id/role', isAuthenticated, isAdmin, controller.adminUpdate);
userRouter.delete('/:id', isAuthenticated, isAdmin, controller.delete);

export { userRouter };