import type { ICreateProductDto, IUpdateProductDto, IProduct } from '@zedobambu/shared-types';
import { ProductRepository } from './products.repository';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  createProduct(data: ICreateProductDto): Promise<IProduct> {
    return this.repository.create(data);
  }

  getProducts(): Promise<IProduct[]> {
    return this.repository.findAll();
  }

  getProductById(id: string): Promise<IProduct | null> {
    return this.repository.findById(id);
  }

  updateProduct(id: string, data: IUpdateProductDto): Promise<IProduct | null> {
    return this.repository.update(id, data);
  }

  deleteProduct(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}