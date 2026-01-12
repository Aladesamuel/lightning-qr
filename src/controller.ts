import QRCode from 'qrcode';
import { GenerateQRParams } from './schemas.js';
export async function generateQR(params: GenerateQRParams): Promise<{ buffer: Buffer | string; type: string }> {
    const options: any = {
        errorCorrectionLevel: 'M',
        type: params.format === 'svg' ? 'svg' : 'png',
        quality: 0.92,
        margin: params.margin,
        width: params.size,
        color: {
            dark: params.color_dark,
            light: params.color_light
        }
    };
    if (params.format === 'svg') {
        const svg = await QRCode.toString(params.text, { ...options, type: 'svg' });
        return {
            buffer: svg,
            type: 'image/svg+xml'
        };
    } else {
        const buffer = await QRCode.toBuffer(params.text, options);
        return {
            buffer: buffer,
            type: 'image/png'
        };
    }
}
