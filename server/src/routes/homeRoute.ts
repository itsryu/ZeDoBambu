import { Request, Response } from 'express';
import { JSONResponse, RouteStructure } from '../structures';
import { Logger } from '../utils/logger';

class HomeRoute extends RouteStructure {
    run = (_: Request, res: Response) => {
        try {
            res.status(200).json(new JSONResponse(200, 'Welcome!').toJSON());
        } catch (err) {
            Logger.error((err as Error).message, HomeRoute.name);
            Logger.warn((err as Error).stack, HomeRoute.name);

            res.status(500).json(new JSONResponse(500, 'Internal Server Error').toJSON());
        }
    };
}

export {
    HomeRoute
};