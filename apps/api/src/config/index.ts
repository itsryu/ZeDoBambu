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
  mongoUri: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

const config: IAppConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  localUrl: process.env.LOCAL_URL || 'http://localhost',
  domainUrl: process.env.DOMAIN_URL || '',
  mongoUri: process.env.MONGO_URI || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
};


if (!config.mongoUri) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

if (config.nodeEnv === 'production' && config.jwt.secret === 'default_secret_key') {
    console.warn('WARNING: JWT_SECRET is using the default value in production.');
}


export default config;