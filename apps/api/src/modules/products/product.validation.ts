import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
  description: z.string().min(10, { message: 'A descrição deve ter no mínimo 10 caracteres.' }),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().positive({ message: 'O preço deve ser um número positivo.' })
  ),
  categoryId: z.string().min(1, { message: 'A categoria é obrigatória.' }),
  availability: z.boolean().default(true).optional(),
  imageUrl: z.string().url({ message: 'A URL da imagem deve ser válida.' }).optional().or(z.literal('')),
  ingredients: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();