import * as admin from 'firebase-admin';
import config from './index';
import { Logger } from '@/utils/logger';

const serviceAccount = {
  projectId: config.firebaseProjectId,
  clientEmail: config.firebaseClientEmail,
  privateKey: config.firebasePrivateKey.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    Logger.info('Firebase Admin SDK initialized successfully.', 'FirebaseAdmin');
  } catch (error) {
    const err = error as Error;
    Logger.error(`Firebase Admin SDK initialization failed: ${err.message}`, 'FirebaseAdmin');
    if (err.stack) Logger.debug(err.stack, 'FirebaseAdminStack');
    process.exit(1);
  }
}

export const firebaseAdminAuth = admin.auth();
export const firebaseAdminDb = admin.firestore();