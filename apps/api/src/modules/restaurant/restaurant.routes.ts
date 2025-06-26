import { Router } from 'express';
import { RestaurantController } from './restaurant.controller';
import { isAuthenticated, isAdmin } from '../../core/middlewares/auth.middleware';

const restaurantRouter = Router();
const controller = new RestaurantController();

restaurantRouter.get('/info', controller.getInfo);
restaurantRouter.put('/info', isAuthenticated, isAdmin, controller.updateInfo);

export { restaurantRouter };