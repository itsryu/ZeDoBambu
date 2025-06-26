import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/apiResponse';
import { RestaurantService } from './restaurant.service';
import { updateRestaurantInfoSchema } from '@zedobambu/shared-validation';

export class RestaurantController {
  private service: RestaurantService;

  constructor() {
    this.service = new RestaurantService();
  }

  getInfo = async (_req: Request, res: Response): Promise<Response> => {
    const info = await this.service.getRestaurantInfo();
    if (!info) {
      return ApiResponse.notFound(res, 'Informações do restaurante não encontradas.');
    }
    return ApiResponse.success(res, 'Informações do restaurante obtidas.', info);
  };

  updateInfo = async (req: Request, res: Response): Promise<Response> => {
    const validationResult = updateRestaurantInfoSchema.safeParse(req.body);
    if (!validationResult.success) {
      return ApiResponse.badRequest(res, 'Dados de atualização inválidos.', JSON.stringify(validationResult.error.flatten()));
    }
    
    const updatedInfo = await this.service.updateRestaurantInfo(validationResult.data);
    return ApiResponse.success(res, 'Informações do restaurante atualizadas com sucesso.', updatedInfo);
  };
}