import { QRCodeCanvas, Options } from '@loskir/styled-qr-code-node';
import { GenerateQRParams } from './schemas.js';
const THEMES: Record<string, Partial<Options>> = {
    modern: {
        dotsOptions: { type: 'rounded', color: '#2c3e50' },
        cornersSquareOptions: { type: 'extra-rounded', color: '#2c3e50' },
        cornersDotOptions: { type: 'dot', color: '#3498db' }
    },
    cyberpunk: {
        dotsOptions: { type: 'classy', color: '#ff00ff' },
        backgroundOptions: { color: '#000000' },
        cornersSquareOptions: { type: 'square', color: '#00ffff' },
        cornersDotOptions: { type: 'square', color: '#ff00ff' }
    },
    classic: {
        dotsOptions: { type: 'square', color: '#000000' },
        cornersSquareOptions: { type: 'square', color: '#000000' }
    }
};
export async function generateQR(params: GenerateQRParams): Promise<{ buffer: Buffer | string; type: string }> {
    let options: Options = {
        width: params.size,
        height: params.size,
        data: params.text,
        margin: params.margin,
        qrOptions: {
            errorCorrectionLevel: params.logo_url ? 'H' : 'M'
        },
        dotsOptions: {
            color: params.color_dark,
            type: params.dots_type as any
        },
        backgroundOptions: {
            color: params.color_light
        },
        image: params.logo_url,
        imageOptions: {
            margin: params.logo_margin,
            crossOrigin: 'anonymous',
            imageSize: 0.4
        }
    };
    if (params.theme && THEMES[params.theme]) {
        options = { ...options, ...THEMES[params.theme] };
    }
    if (params.corners_square_type) {
        options.cornersSquareOptions = { ...options.cornersSquareOptions, type: params.corners_square_type as any };
    }
    if (params.corners_dot_type) {
        options.cornersDotOptions = { ...options.cornersDotOptions, type: params.corners_dot_type as any };
    }
    if (params.gradient_type && params.gradient_color) {
        options.dotsOptions = {
            ...options.dotsOptions,
            gradient: {
                type: params.gradient_type as any,
                rotation: 0,
                colorStops: [
                    { offset: 0, color: params.color_dark },
                    { offset: 1, color: params.gradient_color }
                ]
            }
        };
    }
    const qrCode = new QRCodeCanvas(options);
    const format = params.format === 'svg' ? 'svg' : 'png';
    const buffer = await qrCode.toBuffer(format);
    return {
        buffer: buffer,
        type: params.format === 'svg' ? 'image/svg+xml' : 'image/png'
    };
}
