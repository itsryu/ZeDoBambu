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

export interface ICreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  availability?: boolean;
  imageUrl?: string;
  ingredients?: string[];
}

export type IUpdateProductDto = Partial<ICreateProductDto>;