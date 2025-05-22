import express, { Express } from 'express';
import { Logger } from './utils/logger';

class Client {
    private port: number = process.env.PORT ?? 3000;
    public app: Express = express();

    public constructor() {
        process.on('uncaughtException', (err: Error) => { Logger.error(err.stack, 'uncaughtException'); });
        process.on('unhandledRejection', (err: Error) => { Logger.error(err.stack, 'unhandledRejection'); });
    }

    public start() {
        this.app.listen(this.port, () => {
            Logger.info(`Server is running at ${process.env.STATE == 'development' ? `${process.env.LOCAL_URL}:${this.port}/` : process.env.DOMAIN_URL}`, 'Server');
        });
    }
}

export { Client };