import fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes.js';

const server = fastify({
    logger: true
});

const start = async () => {
    try {
        await server.register(cors, {
            origin: '*',
            methods: ['GET', 'POST', 'OPTIONS']
        });

        await server.register(routes);

        if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
            const port = parseInt(process.env.PORT || '3000');
            await server.listen({ port, host: '0.0.0.0' });
            console.log(`⚡ Lightning QR running at http://localhost:${port}`);
        }
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();

export default async function handler(req: any, res: any) {
    await server.ready();
    server.server.emit('request', req, res);
}
