export { };

declare module 'useragent';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly PORT: number;
            readonly STATE: 'development' | 'production';
            readonly LOCAL_URL: string;
            readonly DOMAIN_URL: string;
        }
    }
}