import type { Request, Response } from 'express';
import { ApiResponse } from '@/utils/apiResponse';
import { UserService } from './user.service';
import { adminUpdateUserSchema, updateUserProfileSchema } from '@zedobambu/shared-validation';
import type { IUpdateUserProfileDto } from '@zedobambu/shared-types';


export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getAll = async (req: Request, res: Response): Promise<Response> => {
    const searchTerm = typeof req.query.search === 'string' ? req.query.search : '';
    const users = await this.service.getAllUsers(searchTerm);
    return ApiResponse.success(res, 'Utilizadores listados com sucesso.', users);
  }

  getProfile = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.service.getProfile(req.currentUser!.uid);
    if (!user) {
      return ApiResponse.notFound(res, 'Perfil do usuário não encontrado no banco de dados.');
    }
    return ApiResponse.success(res, 'Perfil do usuário encontrado.', user);
  };

  updateProfile = async (req: Request, res: Response): Promise<Response> => {
    const { uid } = req.currentUser!;
    const validationResult = updateUserProfileSchema.safeParse(req.body);

    if (!validationResult.success) {
      return ApiResponse.badRequest(res, 'Dados de atualização inválidos.', JSON.stringify(validationResult.error.flatten()));
    }

    const updatedUser = await this.service.updateProfile(uid, validationResult.data as IUpdateUserProfileDto);

    if (!updatedUser) {
      return ApiResponse.notFound(res, 'Perfil do usuário não encontrado para atualizar.');
    }
    return ApiResponse.success(res, 'Perfil atualizado com sucesso.', updatedUser);
  };

  adminUpdate = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const validationResult = adminUpdateUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      return ApiResponse.badRequest(res, 'Dados inválidos.', JSON.stringify(validationResult.error.flatten()));
    }

    const updatedUser = await this.service.adminUpdateUser(id, validationResult.data);
    return ApiResponse.success(res, 'Utilizador atualizado com sucesso.', updatedUser);
  }

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    await this.service.deleteUser(id);
    return ApiResponse.success(res, 'Utilizador apagado com sucesso.');
  };
}