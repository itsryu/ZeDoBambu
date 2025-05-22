
import { NextFunction, Request, Response } from 'express';
import { Server } from '../server';

abstract class RouteStructure<T = Request, K = Response, N = NextFunction, V = void> {
    public readonly client: Server;

    public constructor(client: Server) {
        this.client = client;
    }

    public abstract run(req: T, res: K, next: N): Promise<V> | V;
}

export { 
    RouteStructure
};