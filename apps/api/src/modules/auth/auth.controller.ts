import { Request, Response } from 'express';
import { ApiResponse } from '@/utils/apiResponse';
import { firebaseAdminAuth, firebaseAdminDb } from '@/config/firebaseAdmin';
import { IUser  } from '@zedobambu/shared-types';
import { Logger } from '@/utils/logger';
import { Timestamp } from 'firebase-admin/firestore';


export class AuthController {
  public verifyTokenAndSyncUser = async (req: Request, res: Response): Promise<Response> => {
    const { idToken } = req.body;

    if (!idToken) {
      return ApiResponse.badRequest(res, 'idToken is required.');
    }

    try {
      const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken as string);
      const { uid, email, name: firebaseName, picture } = decodedToken;

      const usersCollection = firebaseAdminDb.collection('users');
      const userDocRef = usersCollection.doc(uid);
      const userDoc = await userDocRef.get();

      let userRole: IUserRole = 'customer'; // Default role
      let finalName = firebaseName || email?.split('@')[0] || 'Usuário Anônimo';

      if (!userDoc.exists) {
        // Usuário não existe no Firestore, vamos criar
        const newUserProfile: IUser = {
          id: uid,
          name: finalName,
          email: email || '',
          role: userRole, // Default para 'customer'
          // Adicione outros campos default que desejar
          createdAt: Timestamp.now().toDate(),
          updatedAt: Timestamp.now().toDate(),
        };
        await userDocRef.set(newUserProfile);
        Logger.info(`New user profile created in Firestore: ${uid}`, 'AuthController');

        // Exemplo: Se você quiser dar role de admin ao primeiro usuário ou um UID específico
        // if (uid === "SEU_UID_DE_ADMIN_AQUI_OU_PRIMEIRO_USUARIO_LOGICA") {
        //   await firebaseAdminAuth.setCustomUserClaims(uid, { role: 'admin' });
        //   userRole = 'admin'; // Atualiza role para a resposta
        //   await userDocRef.update({ role: 'admin', updatedAt: Timestamp.now().toDate() });
        //   Logger.info(`Admin role set for new user: ${uid}`, 'AuthController');
        // }
      } else {
        // Usuário existe, apenas sincroniza/obtém dados
        const existingUser = userDoc.data() as IUser;
        userRole = existingUser.role || userRole; // Prioriza role do Firestore
        finalName = existingUser.name || finalName;
        // Opcional: Atualizar nome ou foto se mudou no Firebase Auth
        // await userDocRef.update({
        //   name: finalName,
        //   // picture: picture || existingUser.picture, // Se você armazenar picture
        //   updatedAt: Timestamp.now().toDate(),
        // });
        Logger.info(`User data synced from Firestore for: ${uid}`, 'AuthController');
      }

      // Obter custom claims do Firebase Auth (pode ter sido definido externamente ou no passo acima)
      const firebaseUserAuth = await firebaseAdminAuth.getUser(uid);
      const customClaims = firebaseUserAuth.customClaims || {};
      userRole = customClaims.role || userRole; // Custom claims do Firebase Auth têm prioridade se existirem

      const userProfileResponse: Partial<IUser> & { uid: string; role: string } = {
        uid,
        id: uid,
        email,
        name: finalName,
        role: userRole,
      };

      Logger.info(`Token verified for user: ${uid}, Role: ${userRole}`, 'AuthController');
      return ApiResponse.success(res, 'Token verified and user profile synced.', userProfileResponse);

    } catch (error) {
      const err = error as Error;
      Logger.error(`Error verifying token: ${err.message}`, 'AuthController');
      return ApiResponse.unauthorized(res, 'Invalid Firebase ID token.', err.message);
    }
  };

  public getCurrentUser = (req: Request, res: Response): Response => {
    if (!req.currentUser) {
      return ApiResponse.unauthorized(res, 'Not authenticated.');
    }
    return ApiResponse.success(res, 'Current user data.', req.currentUser);
  };
}