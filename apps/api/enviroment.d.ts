export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly PORT?: string;
            readonly NODE_ENV?: 'development' | 'production';
            readonly LOCAL_URL?: string;
            readonly DOMAIN_URL?: string;
            readonly MONGO_URI: string;
            readonly JWT_SECRET: string;
            readonly JWT_EXPIRES_IN: string;
        }
    }
}