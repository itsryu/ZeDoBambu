import { Request, Response } from 'express';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatus, ICreateProductDto } from '@zedobambu/shared-types';
import { ProductService } from './product.service';
import { createProductSchema, updateProductSchema } from '@zedobambu/shared-validation';

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    const validationResult = createProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      return ApiResponse.badRequest(res, 'Dados inválidos.', JSON.stringify(validationResult.error.flatten()));
    }

    const product = await this.service.createProduct(validationResult.data as ICreateProductDto);
    return ApiResponse.created(res, 'Produto criado com sucesso.', product);
  };

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const products = await this.service.getProducts();
    return ApiResponse.success(res, 'Produtos listados com sucesso.', products);
  };

  getOne = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const product = await this.service.getProductById(id);
    if (!product) {
      return ApiResponse.notFound(res, 'Produto não encontrado.');
    }
    return ApiResponse.success(res, 'Produto encontrado.', product);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const validationResult = updateProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      return ApiResponse.badRequest(res, 'Dados inválidos.', JSON.stringify(validationResult.error.flatten()));
    }

    const updatedProduct = await this.service.updateProduct(id, validationResult.data);
    if (!updatedProduct) {
      return ApiResponse.notFound(res, 'Produto não encontrado.');
    }
    return ApiResponse.success(res, 'Produto atualizado com sucesso.', updatedProduct);
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const wasDeleted = await this.service.deleteProduct(id);
    if (!wasDeleted) {
      return ApiResponse.notFound(res, 'Produto não encontrado.');
    }
    return ApiResponse.success(res, 'Produto deletado com sucesso.', undefined, HttpStatus.NO_CONTENT);
  };
}