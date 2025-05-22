import express, { Router } from 'express';
import cors from 'cors';
import { join } from 'node:path';
import { HomeRoute, NotFoundRoute } from './routes';
import { RouteStructure } from './structures';
import { Client } from './client';

interface Route {
    method: 'get' | 'post' | 'delete' | 'put' | 'patch' | 'options' | 'head';
    path: string;
    handler: RouteStructure;
};

class Server extends Client {
    public constructor() {
        super();
        this.config();
    }

    private config(): void {
        this.app.set('view engine', 'html');
        this.app.set('trust proxy', true);
        this.app.use(cors());
        this.app.use(express.static(join(__dirname, '../public')));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(this.initRoutes());
        this.app.use((req, res) => { new NotFoundRoute(this).run(req, res); });
    }

    private initRoutes(): Router {
        const router = Router();
        const routes = this.loadRoutes();

        routes.forEach((route) => {
            const { method, path, handler } = route;

            switch (method) {
                case 'get':
                    router.get(path, handler.run.bind(handler));
                    break;
                case 'post':
                    router.post(path, handler.run.bind(handler));
                    break;
                default:
                    break;
            }
        });

        return router;
    }

    private loadRoutes(): Route[] {
        const routes: Route[] = [
            { method: 'get', path: '/', handler: new HomeRoute(this) }
        ];

        return routes;
    }
}

export { Server };