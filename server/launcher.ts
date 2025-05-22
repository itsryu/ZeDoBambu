import { config } from 'dotenv';
import { Server } from './src/server';

config({ path: './.env' });

const server = new Server();

(() => {
    server.start();
})();