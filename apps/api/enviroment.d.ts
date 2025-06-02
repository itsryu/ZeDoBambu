export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly PORT?: string;
            readonly NODE_ENV?: 'development' | 'production';
            readonly LOCAL_URL?: string;
            readonly DOMAIN_URL?: string;
            readonly JWT_SECRET: string; // Pode ser removido se usar apenas Firebase Auth
            readonly JWT_EXPIRES_IN: string; // Pode ser removido

            // Firebase Admin SDK (para service account)
            readonly FIREBASE_PROJECT_ID: string;
            readonly FIREBASE_CLIENT_EMAIL: string;
            readonly FIREBASE_PRIVATE_KEY: string; // Deve ser a chave formatada corretamente (com \n)
        }
    }
}