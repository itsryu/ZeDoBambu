import { Router } from 'express';
import { ProductController } from './product.controller';
import { isAuthenticated, isAdmin } from '@/core/middlewares/auth.middleware';

const productRouter = Router();
const controller = new ProductController();

// Rotas públicas
productRouter.get('/', controller.getAll);
productRouter.get('/:id', controller.getOne);

// Rotas protegidas para administradores
productRouter.post('/', isAuthenticated, isAdmin, controller.create);
productRouter.put('/:id', isAuthenticated, isAdmin, controller.update);
productRouter.delete('/:id', isAuthenticated, isAdmin, controller.delete);

export { productRouter };