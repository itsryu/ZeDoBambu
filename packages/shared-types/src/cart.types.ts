import { IProduct } from './product.types';

export interface ICartItem extends IProduct {
  quantity: number;
}