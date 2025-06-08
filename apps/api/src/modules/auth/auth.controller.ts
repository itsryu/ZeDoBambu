import type { Request, Response } from 'express';
import { ApiResponse } from '@/utils/apiResponse';
import { firebaseAdminAuth, firebaseAdminDb } from '@/config/firebaseAdmin';
import type { IUser } from '@zedobambu/shared-types';
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
      const { uid, email, name: firebaseName } = decodedToken;

      const usersCollection = firebaseAdminDb.collection('users');
      const userDocRef = usersCollection.doc(uid);
      const userDoc = await userDocRef.get();

      let userRole: IUser['role'] = 'customer';
      let finalName = firebaseName || email?.split('@')[0] || 'Usuário Anônimo';

      if (!userDoc.exists) {
        const newUserProfile: IUser = {
          id: uid,
          name: finalName,
          email: email || '',
          role: userRole,
          disabled: false,
          createdAt: Timestamp.now().toDate(),
          updatedAt: Timestamp.now().toDate(),
        };
        await userDocRef.set(newUserProfile);
        Logger.info(`New user profile created in Firestore: ${uid}`, 'AuthController');
      } else {
        const existingUser = userDoc.data() as IUser;
        userRole = existingUser.role || userRole;
        finalName = existingUser.name || finalName;
        Logger.info(`User data synced from Firestore for: ${uid}`, 'AuthController');
      }

      const firebaseUserAuth = await firebaseAdminAuth.getUser(uid);
      const customClaims = firebaseUserAuth.customClaims || {};
      userRole = (customClaims.role as IUser['role']) || userRole;

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