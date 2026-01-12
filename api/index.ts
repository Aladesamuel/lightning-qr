import fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from '../src/routes.js';

let app: any = null;

async function getApp() {
    if (!app) {
        app = fastify({ logger: false });

        await app.register(cors, {
            origin: '*',
            methods: ['GET', 'POST', 'OPTIONS']
        });

        await app.register(routes);
        await app.ready();
    }
    return app;
}

export default async function handler(req: any, res: any) {
    const server = await getApp();
    server.server.emit('request', req, res);
}
