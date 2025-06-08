import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.').optional(),
  phone: z.string().min(10, 'O telefone deve ter no mínimo 10 dígitos.').optional().or(z.literal('')),
  avatarUrl: z.string().url('URL do avatar inválida.').optional().or(z.literal('')),
  address: z.object({
    street: z.string().min(3, 'Rua inválida.'),
    number: z.string().min(1, 'Número inválido.'),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, 'Bairro inválido.'),
    city: z.string().min(3, 'Cidade inválida.'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres.'),
    zip: z.string().min(8, 'CEP deve ter 8 caracteres.'),
  }).optional(),
});

export const adminUpdateUserSchema = z.object({
  role: z.enum(['admin', 'customer']),
});