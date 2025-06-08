import type { Request, Response, NextFunction } from 'express';
import { firebaseAdminAuth, firebaseAdminDb } from '@/config/firebaseAdmin';
import { ApiResponse } from '@/utils/apiResponse';
import type { IUser } from '@zedobambu/shared-types';
import { Logger } from '@/utils/logger';

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUser & { uid: string; role: string; email?: string };
    }
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return ApiResponse.unauthorized(res, 'No token provided or token format is incorrect.');
  }

  const idToken = authorizationHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
    const { uid, email, name: firebaseName } = decodedToken;

    const userDocRef = firebaseAdminDb.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    let userRole = 'customer';
    let userName = firebaseName || email?.split('@')[0] || 'Usuário';
    let userProfileData: Partial<IUser> = {};

    if (userDoc.exists) {
      const firestoreUser = userDoc.data() as IUser;
      userRole = firestoreUser.role || userRole;
      userName = firestoreUser.name || userName;
      userProfileData = firestoreUser;
    } else {
      Logger.warn(`User profile not found in Firestore for UID: ${uid}. Using default role.`, 'AuthMiddleware');
    }

    req.currentUser = {
      ...userProfileData,
      uid,
      id: uid,
      email,
      name: userName,
      role: userRole,
      createdAt: userProfileData.createdAt || new Date(decodedToken.iat! * 1000),
      updatedAt: userProfileData.updatedAt || new Date(decodedToken.auth_time! * 1000),
    } as IUser & { uid: string; role: string; email?: string };

    Logger.info(`User authenticated: ${uid}, Role: ${userRole}`, 'AuthMiddleware');
    next();
  } catch (error) {
    const err = error as Error;
    Logger.error(`Token verification failed: ${err.message}`, 'AuthMiddleware');
    if (err.name === 'auth/id-token-revoked') {
      return ApiResponse.unauthorized(res, 'Token has been revoked. Please sign in again.');
    }
    return ApiResponse.unauthorized(res, 'Invalid or expired token.');
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.currentUser?.role === 'admin') {
    next();
  } else {
    return ApiResponse.forbidden(res, 'Access denied. Admin role required.');
  }
};