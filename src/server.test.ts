import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fastify from 'fastify';
import { routes } from './routes.js';

describe('QR API', () => {
    const server = fastify();

    beforeAll(async () => {
        server.register(routes);
        await server.ready();
    });

    afterAll(async () => {
        await server.close();
    });

    it('should generate a PNG QR code by default', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/generate',
            query: { text: 'Hello World' }
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.rawPayload.length).toBeGreaterThan(0);
    });

    it('should generate an SVG QR code', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/generate',
            query: { text: 'Hello World', format: 'svg' }
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe('image/svg+xml');
        expect(response.payload).toContain('<svg');
    });

    it('should fail when text is missing', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/generate'
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.payload);
        expect(body.message).toBe('Validation failed');
    });

    it('should validate hex colors', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/generate',
            query: { text: 'Test', color_dark: 'invalid' }
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.payload);
        expect(body.details[0]).toContain('Invalid hex color');
    });

    it('should generate a QR code with a theme', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/generate',
            query: { text: 'Theme Test', theme: 'modern' }
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
    });

    it('should generate a QR code with a gradient', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/generate',
            query: {
                text: 'Gradient Test',
                gradient_type: 'linear',
                gradient_color: '#00ff00'
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
    });
});
