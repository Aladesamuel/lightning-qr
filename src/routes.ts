import { FastifyInstance } from 'fastify';
import { generateQRSchema } from './schemas.js';
import { generateQR } from './controller.js';

export async function routes(fastify: FastifyInstance) {
    fastify.get('/generate', async (request, reply) => {
        try {
            const params = generateQRSchema.parse(request.query);
            const { buffer, type } = await generateQR(params);
            reply.type(type);
            return buffer;
        } catch (error: any) {
            if (error.issues) {
                reply.status(400).send({
                    error: "Bad Request",
                    message: "Validation failed",
                    details: error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`)
                });
            } else {
                fastify.log.error(error);
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    });

    fastify.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
}
