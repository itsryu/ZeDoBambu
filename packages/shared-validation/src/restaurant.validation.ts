import { z } from 'zod';
import { updateUserProfileSchema } from './user.validation.js';

const addressSchema = updateUserProfileSchema.shape.address; // Extrai o schema de endereço

export const updateRestaurantInfoSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.').optional(),
  cnpj: z.string().min(14, 'O CNPJ deve ter 14 dígitos.').optional(),
  phone: z.string().min(10, 'O telefone deve ter no mínimo 10 dígitos.').optional(),
  address: addressSchema.optional(),
  openingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }).optional(),
});