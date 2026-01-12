import fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes.js';

const server = fastify({
    logger: true
});

server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS']
});

server.register(routes);

export default async (req: any, res: any) => {
    await server.ready();
    server.server.emit('request', req, res);
};

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const start = async () => {
        try {
            const port = parseInt(process.env.PORT || '3000');
            await server.listen({ port, host: '0.0.0.0' });
            console.log(`⚡ Lightning QR running at http://localhost:${port}`);
        } catch (err) {
            server.log.error(err);
            process.exit(1);
        }
    };
    start();
              }
