import dotenv from 'dotenv';
import path from 'path';

const envPath = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../.env.production')
  : path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

interface IAppConfig {
  port: number;
  nodeEnv: 'development' | 'production';
  localUrl: string;
  domainUrl: string;
  firebaseProjectId: string;
  firebaseClientEmail: string;
  firebasePrivateKey: string;
}

const config: IAppConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  localUrl: process.env.LOCAL_URL || 'http://localhost',
  domainUrl: process.env.DOMAIN_URL || '',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY || '',
};

if (!config.firebaseProjectId || !config.firebaseClientEmail || !config.firebasePrivateKey) {
  console.error('FATAL ERROR: Firebase Admin SDK credentials are not defined in environment variables.');
  process.exit(1);
}

export default config;