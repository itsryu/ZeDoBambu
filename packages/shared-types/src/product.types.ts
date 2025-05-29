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
    category: IProductCategory | string;
    imageUrl?: string;
    availability: boolean;
    ingredients?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type ICreateProductDto = Omit<IProduct, 'id' | 'createdAt' | 'updatedAt' | 'category'> & {
    categoryId: string;
};

export type IUpdateProductDto = Partial<ICreateProductDto>;