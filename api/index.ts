import fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from '../src/routes.js';
const app = fastify({ logger: false });
app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS']
});
app.register(routes);
await app.ready();
export default async function handler(req: any, res: any) {
    app.server.emit('request', req, res);
}
