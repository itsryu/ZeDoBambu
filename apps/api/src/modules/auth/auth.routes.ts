import { Router } from 'express';
import { AuthController } from './auth.controller';
import { isAuthenticated } from '@/core/middlewares/auth.middleware';

const authRouter = Router();
const authController = new AuthController();

// Endpoint para o cliente chamar após o login/cadastro no Firebase
// para registrar/atualizar o usuário no backend (se necessário)
// e potencialmente obter um token de sessão do backend ou dados de perfil.
authRouter.post('/verify-token', authController.verifyTokenAndSyncUser);

// Exemplo de rota protegida
authRouter.get('/me', isAuthenticated, authController.getCurrentUser);

export { authRouter };