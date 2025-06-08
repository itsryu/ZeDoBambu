export interface IProductCategory {
  id: string;
  name: string;
  description?: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: IProductCategory;
  imageUrl?: string;
  availability: boolean;
  ingredients?: string[];
  createdAt: Date;
  updatedAt: Date;
}


import { z } from 'zod';
import { createProductSchema, updateProductSchema } from './product.validation';

export type ICreateProductDto = z.infer<typeof createProductSchema>;
export type IUpdateProductDto = z.infer<typeof updateProductSchema>;